using MarketFlow.Application.DTOs;
using MarketFlow.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MarketFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/cart
    [HttpGet]
    public async Task<IActionResult> GetMyCart()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return Ok(new CartResponseDto());

        var items = cart.Items.Select(i => new CartItemDto
        {
            Id = i.Id,
            ProductId = i.ProductId,
            Name = i.Product.Name,
            Price = i.Product.Price,
            Quantity = i.Quantity
        }).ToList();

        var response = new CartResponseDto
        {
            Items = items,
            TotalPrice = items.Sum(i => i.Total)
        };

        return Ok(response);
    }

    // POST: api/cart/add
    [HttpPost("add")]
    public async Task<IActionResult> AddToCart(int productId, int quantity = 1)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Domain.Entities.Cart
            {
                UserId = userId
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        var existingItem = cart.Items
            .FirstOrDefault(i => i.ProductId == productId);

        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            cart.Items.Add(new Domain.Entities.CartItem
            {
                ProductId = productId,
                Quantity = quantity
            });
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Added to cart" });
    }

    // PUT: api/cart/item/1
    [HttpPut("item/{id}")]
    public async Task<IActionResult> UpdateQuantity(int id, int quantity)
    {
        var item = await _context.CartItems.FindAsync(id);

        if (item == null)
            return NotFound();

        item.Quantity = quantity;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Quantity updated" });
    }

    // DELETE: api/cart/item/1
    [HttpDelete("item/{id}")]
    public async Task<IActionResult> RemoveItem(int id)
    {
        var item = await _context.CartItems.FindAsync(id);

        if (item == null)
            return NotFound();

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Item removed" });
    }
}