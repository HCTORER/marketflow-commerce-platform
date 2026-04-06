namespace MarketFlow.Application.DTOs;

public class CartResponseDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
}