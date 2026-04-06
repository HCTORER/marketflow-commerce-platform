namespace MarketFlow.Application.DTOs;

public class OrderResponseDto
{
    public int Id { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = null!;
    public List<OrderItemDto> Items { get; set; } = new();
}