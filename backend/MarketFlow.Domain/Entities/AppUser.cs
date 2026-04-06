using MarketFlow.Domain.Common;

namespace MarketFlow.Domain.Entities;

public class AppUser : BaseEntity
{
    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = "Customer";

    public int? StoreId { get; set; }

    public Store? Store { get; set; }

    public ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public ICollection<Order> Orders { get; set; } = new List<Order>();

    public ICollection<Address> Addresses { get; set; } = new List<Address>();
}