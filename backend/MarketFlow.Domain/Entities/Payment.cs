using MarketFlow.Domain.Common;

namespace MarketFlow.Domain.Entities;

public class Payment : BaseEntity
{
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public string Provider { get; set; } = "Iyzico";
    public string Status { get; set; } = "Pending";

    public decimal Amount { get; set; }

    public string? ConversationId { get; set; }
    public string? PaymentId { get; set; }
    public string? Token { get; set; }
    public string? CallbackUrl { get; set; }
    public string? RawResponse { get; set; }
}