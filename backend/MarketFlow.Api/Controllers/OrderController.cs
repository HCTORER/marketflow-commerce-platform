using System.Security.Claims;
using MarketFlow.Application.DTOs;
using MarketFlow.Domain.Entities;
using MarketFlow.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MarketFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/order/checkout
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequestDto request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.Items.Any())
            return BadRequest(new { message = "Cart is empty." });

        var address = await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == request.AddressId && a.UserId == userId);

        if (address == null)
            return BadRequest(new { message = "Address not found." });

        // STOCK CONTROL
        foreach (var item in cart.Items)
        {
            if (item.Product.Stock < item.Quantity)
            {
                return BadRequest(new
                {
                    message = $"Insufficient stock for {item.Product.Name}"
                });
            }
        }

        var order = new Order
        {
            UserId = userId,
            AddressId = address.Id,
            Status = "Pending",
            TotalPrice = cart.Items.Sum(i => i.Quantity * i.Product.Price),
            Items = cart.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                UnitPrice = i.Product.Price,
                Quantity = i.Quantity,
                TotalPrice = i.Quantity * i.Product.Price
            }).ToList()
        };

        // STOCK DÜŞÜR
        foreach (var item in cart.Items)
        {
            item.Product.Stock -= item.Quantity;
        }

        _context.Orders.Add(order);

        // CART TEMİZLE
        _context.CartItems.RemoveRange(cart.Items);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Order created",
            order.Id,
            order.TotalPrice
        });
    }

    // GET: api/order/my
    [HttpGet("my")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var orders = await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderResponseDto
            {
                Id = o.Id,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    TotalPrice = i.TotalPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }
}