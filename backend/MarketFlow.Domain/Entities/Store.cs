using MarketFlow.Domain.Common;

namespace MarketFlow.Domain.Entities;

public class Store : BaseEntity
{
    public string Name { get; set; } = null!;

    public string Description { get; set; } = "";

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = "";

    public ICollection<AppUser> Users { get; set; } = new List<AppUser>();

    public ICollection<Product> Products { get; set; } = new List<Product>();
}