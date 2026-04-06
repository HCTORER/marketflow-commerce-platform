using System.Text;
using MarketFlow.Infrastructure.Data;
using MarketFlow.Infrastructure.Payments.Iyzico;
using MarketFlow.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Frontend localhost:5173 için CORS izni
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://marketflow-commerce-platform.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Iyzico settings bind
builder.Services.Configure<IyzicoSettings>(
    builder.Configuration.GetSection("Iyzico"));

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IyzicoPaymentService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// CORS middleware
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Önce veritabanını ve tabloları oluştur / migration uygula
    await db.Database.MigrateAsync();

    // Sonra seed data çalıştır
    await SeedData.Initialize(db);
}

app.Urls.Add("http://0.0.0.0:8080");
app.Run();

