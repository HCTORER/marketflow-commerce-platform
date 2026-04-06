using MarketFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarketFlow.Infrastructure.Data;

public static class SeedData
{
    public static async Task Initialize(AppDbContext context)
    {
        if (await context.Users.AnyAsync())
            return;

        var store = new Store
        {
            Name = "MarketFlow Store",
            Email = "store@marketflow.com"
        };

        var admin = new AppUser
        {
            FullName = "Admin User",
            Email = "admin@marketflow.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Role = "StoreAdmin",
            Store = store
        };

        // Categories
        var electronics = new Category
        {
            Name = "Electronics"
        };

        var travelLifestyle = new Category
        {
            Name = "Travel & Lifestyle"
        };

        var fashion = new Category
        {
            Name = "Fashion"
        };

        // Brands
        var apple = new Brand
        {
            Name = "Apple"
        };

        var genericBrand = new Brand
        {
            Name = "MarketFlow Brand"
        };

        var outdoorBrand = new Brand
        {
            Name = "Outdoor X"
        };

        // Products
        var products = new List<Product>
        {
            new Product
            {
                Name = "iPhone 15",
                Description = "Latest iPhone model with premium design.",
                Price = 50000,
                Stock = 10,
                ImageUrl = "/products/iphone15.png",
                Category = electronics,
                Brand = apple,
                Store = store
            },
            new Product
            {
                Name = "Laptop Pro 14",
                Description = "Lightweight laptop for work and productivity.",
                Price = 32000,
                Stock = 6,
                ImageUrl = "/products/laptop.png",
                Category = electronics,
                Brand = apple,
                Store = store
            },
            new Product
            {
                Name = "Travel Suitcase",
                Description = "Durable suitcase for long trips.",
                Price = 4500,
                Stock = 10,
                ImageUrl = "/products/valiz.png",
                Category = travelLifestyle,
                Brand = genericBrand,
                Store = store
            },
            new Product
            {
                Name = "Winter Coat",
                Description = "Warm and stylish coat for cold weather.",
                Price = 2800,
                Stock = 14,
                ImageUrl = "/products/mont.png",
                Category = fashion,
                Brand = genericBrand,
                Store = store
            },
            new Product
            {
                Name = "Casual Shoes",
                Description = "Comfortable everyday shoes.",
                Price = 1900,
                Stock = 20,
                ImageUrl = "/products/ayakkabi.png",
                Category = fashion,
                Brand = genericBrand,
                Store = store
            },
            new Product
            {
                Name = "Backpack",
                Description = "Multi-purpose backpack for daily use.",
                Price = 1200,
                Stock = 18,
                ImageUrl = "/products/canta.png",
                Category = travelLifestyle,
                Brand = genericBrand,
                Store = store
            },
            new Product
            {
                Name = "Mountain Bike",
                Description = "Sport bike designed for city and outdoor rides.",
                Price = 15000,
                Stock = 5,
                ImageUrl = "/products/bisiklet.png",
                Category = travelLifestyle,
                Brand = outdoorBrand,
                Store = store
            },
            new Product
            {
                Name = "Basic Sweater",
                Description = "Soft sweater for everyday comfort.",
                Price = 950,
                Stock = 16,
                ImageUrl = "/products/kazak.png",
                Category = fashion,
                Brand = genericBrand,
                Store = store
            }
        };

        context.Add(store);
        context.Add(admin);

        context.Add(electronics);
        context.Add(travelLifestyle);
        context.Add(fashion);

        context.Add(apple);
        context.Add(genericBrand);
        context.Add(outdoorBrand);

        context.AddRange(products);

        await context.SaveChangesAsync();
    }
}