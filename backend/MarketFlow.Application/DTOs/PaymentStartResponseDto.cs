namespace MarketFlow.Application.DTOs;

public class PaymentStartResponseDto
{
    public int PaymentId { get; set; }
    public int OrderId { get; set; }
    public string Status { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Provider { get; set; } = null!;
    public string ConversationId { get; set; } = null!;
    public string? Token { get; set; }
    public string? PaymentPageUrl { get; set; }
}