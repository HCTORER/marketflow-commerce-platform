using MarketFlow.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MarketFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "StoreAdmin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/admin/orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .Include(o => o.Address)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.Id,
                customerName = o.User.FullName,
                customerEmail = o.User.Email,
                o.TotalPrice,
                o.Status,
                address = new
                {
                    o.Address.Title,
                    o.Address.FullName,
                    o.Address.City,
                    o.Address.District,
                    o.Address.FullAddress,
                    o.Address.PostalCode
                },
                items = o.Items.Select(i => new
                {
                    i.ProductId,
                    i.ProductName,
                    i.UnitPrice,
                    i.Quantity,
                    i.TotalPrice
                }),
                o.CreatedAt
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/admin/orders/5
    [HttpGet("orders/{id}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .Include(o => o.User)
            .Include(o => o.Address)
            .Include(o => o.Payment)
            .Where(o => o.Id == id)
            .Select(o => new
            {
                o.Id,
                customer = new
                {
                    o.User.Id,
                    o.User.FullName,
                    o.User.Email
                },
                o.TotalPrice,
                o.Status,
                address = new
                {
                    o.Address.Id,
                    o.Address.Title,
                    o.Address.FullName,
                    o.Address.PhoneNumber,
                    o.Address.City,
                    o.Address.District,
                    o.Address.FullAddress,
                    o.Address.PostalCode
                },
                items = o.Items.Select(i => new
                {
                    i.ProductId,
                    i.ProductName,
                    i.UnitPrice,
                    i.Quantity,
                    i.TotalPrice
                }),
                payment = o.Payment == null ? null : new
                {
                    o.Payment.Id,
                    o.Payment.Provider,
                    o.Payment.Status,
                    o.Payment.Amount,
                    o.Payment.ConversationId,
                    o.Payment.PaymentId,
                    o.Payment.CreatedAt
                },
                o.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(new { message = "Order not found." });

        return Ok(order);
    }

    // GET: api/admin/payments
    [HttpGet("payments")]
    public async Task<IActionResult> GetAllPayments()
    {
        var payments = await _context.Payments
            .Include(p => p.Order)
            .ThenInclude(o => o.User)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                p.OrderId,
                customerName = p.Order.User.FullName,
                customerEmail = p.Order.User.Email,
                p.Provider,
                p.Status,
                p.Amount,
                p.ConversationId,
                p.PaymentId,
                p.CreatedAt
            })
            .ToListAsync();

        return Ok(payments);
    }
}