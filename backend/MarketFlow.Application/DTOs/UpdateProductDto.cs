namespace MarketFlow.Application.DTOs;

public class UpdateProductDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = "";
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int CategoryId { get; set; }
    public int BrandId { get; set; }
}