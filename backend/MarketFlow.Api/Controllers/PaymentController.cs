using System.Security.Claims;
using MarketFlow.Application.DTOs;
using MarketFlow.Domain.Entities;
using MarketFlow.Infrastructure.Data;
using MarketFlow.Infrastructure.Payments.Iyzico;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MarketFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IyzicoPaymentService _iyzicoPaymentService;

    public PaymentController(
        AppDbContext context,
        IyzicoPaymentService iyzicoPaymentService)
    {
        _context = context;
        _iyzicoPaymentService = iyzicoPaymentService;
    }

    // POST: api/payment/start
    [HttpPost("start")]
    public async Task<IActionResult> StartPayment(CreatePaymentRequestDto request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var order = await _context.Orders
            .Include(o => o.Payment)
            .Include(o => o.Items)
            .Include(o => o.Address)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId);

        if (order == null)
            return NotFound(new { message = "Order not found." });

        if (order.Payment != null)
            return BadRequest(new { message = "Payment already exists for this order." });

        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null)
            return NotFound(new { message = "User not found." });

        var initResult = await _iyzicoPaymentService.InitializeCheckoutFormAsync(
            order,
            user,
            order.Address);

        var payment = new Payment
        {
            OrderId = order.Id,
            Provider = "Iyzico",
            Status = string.IsNullOrWhiteSpace(initResult.Status) ? "Pending" : initResult.Status,
            Amount = order.TotalPrice,
            ConversationId = initResult.ConversationId,
            Token = initResult.Token,
            CallbackUrl = initResult.PaymentPageUrl,
            RawResponse = $"Status: {initResult.Status}, ConversationId: {initResult.ConversationId}, Token: {initResult.Token}"
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        var response = new PaymentStartResponseDto
        {
            PaymentId = payment.Id,
            OrderId = order.Id,
            Status = payment.Status,
            Amount = payment.Amount,
            Provider = payment.Provider,
            ConversationId = payment.ConversationId ?? "",
            Token = payment.Token,
            PaymentPageUrl = initResult.PaymentPageUrl
        };

        return Ok(response);
    }

    // GET: api/payment/order/1
    [HttpGet("order/{orderId}")]
    public async Task<IActionResult> GetPaymentByOrder(int orderId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var payment = await _context.Payments
            .Include(p => p.Order)
            .Where(p => p.Order.Id == orderId && p.Order.UserId == userId)
            .Select(p => new
            {
                p.Id,
                p.OrderId,
                p.Provider,
                p.Status,
                p.Amount,
                p.ConversationId,
                p.PaymentId,
                p.Token,
                p.CallbackUrl,
                p.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (payment == null)
            return NotFound(new { message = "Payment not found." });

        return Ok(payment);
    }

    // POST: api/payment/test-fail/5
    [HttpPost("test-fail/{orderId}")]
    [Authorize(Roles = "StoreAdmin")]
    public async Task<IActionResult> TestFail(int orderId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var payment = await _context.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.OrderId == orderId && p.Order.UserId == userId);

        if (payment == null)
            return NotFound(new { message = "Payment not found." });

        payment.Status = "FAILURE";

        if (payment.Order != null)
            payment.Order.Status = "PaymentFailed";

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Payment marked as failed.",
            payment.OrderId,
            payment.Status,
            orderStatus = payment.Order?.Status
        });
    }

    // POST: api/payment/test-cancel/5
    [HttpPost("test-cancel/{orderId}")]
    [Authorize(Roles = "StoreAdmin")]
    public async Task<IActionResult> TestCancel(int orderId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var payment = await _context.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.OrderId == orderId && p.Order.UserId == userId);

        if (payment == null)
            return NotFound(new { message = "Payment not found." });

        payment.Status = "CANCELLED";

        if (payment.Order != null)
            payment.Order.Status = "Cancelled";

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Payment marked as cancelled.",
            payment.OrderId,
            payment.Status,
            orderStatus = payment.Order?.Status
        });
    }


    // GET: api/payment/callback?token=xxxx
    [AllowAnonymous]
    [HttpGet("callback")]
    public async Task<IActionResult> CallbackGet([FromQuery] string token)
    {
        return await ProcessCallbackToken(token);
    }

    // POST: api/payment/callback
    [AllowAnonymous]
    [HttpPost("callback")]
    public async Task<IActionResult> CallbackPost()
    {
        var form = await Request.ReadFormAsync();
        var token = form["token"].ToString();

        return await ProcessCallbackToken(token);
    }

    private async Task<IActionResult> ProcessCallbackToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return BadRequest("Token is missing.");

        var payment = await _context.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.Token == token);

        if (payment == null)
            return NotFound("Payment record not found.");

        var checkoutResult = await _iyzicoPaymentService.RetrieveCheckoutFormAsync(token);

        payment.Status = string.IsNullOrWhiteSpace(checkoutResult.PaymentStatus)
            ? (checkoutResult.Status ?? "Failed")
            : checkoutResult.PaymentStatus;

        payment.PaymentId = checkoutResult.PaymentId;
        payment.RawResponse =
            $"Status: {checkoutResult.Status}, PaymentStatus: {checkoutResult.PaymentStatus}, ConversationId: {checkoutResult.ConversationId}, PaymentId: {checkoutResult.PaymentId}";

        if (payment.Order != null)
        {
            if (payment.Status.Equals("SUCCESS", StringComparison.OrdinalIgnoreCase))
            {
                payment.Order.Status = "Paid";
            }
            else if (payment.Status.Equals("FAILURE", StringComparison.OrdinalIgnoreCase))
            {
                payment.Order.Status = "PaymentFailed";
            }
            else if (payment.Status.Equals("CANCELLED", StringComparison.OrdinalIgnoreCase) ||
                    payment.Status.Equals("CANCELED", StringComparison.OrdinalIgnoreCase))
            {
                payment.Order.Status = "Cancelled";
            }
            else
            {
                payment.Order.Status = "PaymentFailed";
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Payment callback processed.",
            payment.OrderId,
            paymentStatus = payment.Status,
            orderStatus = payment.Order?.Status,
            payment.PaymentId
        });
    }
}