using MarketFlow.Domain.Common;

namespace MarketFlow.Domain.Entities;

public class Cart : BaseEntity
{
    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}