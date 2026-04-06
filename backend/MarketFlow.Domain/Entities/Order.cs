using MarketFlow.Domain.Common;

namespace MarketFlow.Domain.Entities;

public class Order : BaseEntity
{
    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public int AddressId { get; set; }
    public Address Address { get; set; } = null!;

    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = "Pending";

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public Payment? Payment { get; set; }
}