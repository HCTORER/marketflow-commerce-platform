using MarketFlow.Application.DTOs;
using MarketFlow.Domain.Entities;
using MarketFlow.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MarketFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/product
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Store)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                p.Stock,
                p.ImageUrl,
                Category = new
                {
                    p.Category.Id,
                    p.Category.Name
                },
                Brand = new
                {
                    p.Brand.Id,
                    p.Brand.Name
                },
                Store = new
                {
                    p.Store.Id,
                    p.Store.Name
                },
                p.CreatedAt
            })
            .ToListAsync();

        return Ok(products);
    }
    // GET: api/product/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _context.Products
            .Where(p => p.Id == id)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                p.Stock,
                p.ImageUrl,
                Category = new
                {
                    p.Category.Id,
                    p.Category.Name
                },
                Brand = new
                {
                    p.Brand.Id,
                    p.Brand.Name
                },
                Store = new
                {
                    p.Store.Id,
                    p.Store.Name,
                    p.Store.Email
                },
                p.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (product is null)
            return NotFound(new { message = "Product not found." });

        return Ok(product);
    }

    // POST: api/product
    [HttpPost]
    [Authorize(Roles = "StoreAdmin")]
    public async Task<IActionResult> Create(CreateProductDto request)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
            return BadRequest(new { message = "Category not found." });

        var brandExists = await _context.Brands.AnyAsync(b => b.Id == request.BrandId);
        if (!brandExists)
            return BadRequest(new { message = "Brand not found." });

        var storeExists = await _context.Stores.AnyAsync(s => s.Id == request.StoreId);
        if (!storeExists)
            return BadRequest(new { message = "Store not found." });

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            CategoryId = request.CategoryId,
            BrandId = request.BrandId,
            StoreId = request.StoreId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Product created successfully.",
            product.Id,
            product.Name
        });
    }

    // PUT: api/product/1
    [HttpPut("{id}")]
    [Authorize(Roles = "StoreAdmin")]
    public async Task<IActionResult> Update(int id, UpdateProductDto request)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound(new { message = "Product not found." });

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.CategoryId = request.CategoryId;
        product.BrandId = request.BrandId;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Product updated successfully." });
    }

    // DELETE: api/product/1
    [HttpDelete("{id}")]
    [Authorize(Roles = "StoreAdmin")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound(new { message = "Product not found." });

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Product deleted successfully." });
    }
}