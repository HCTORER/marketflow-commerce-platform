using MarketFlow.Domain.Common;

namespace MarketFlow.Domain.Entities;

public class Address : BaseEntity
{
    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public string Title { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string City { get; set; } = null!;
    public string District { get; set; } = null!;
    public string FullAddress { get; set; } = null!;
    public string PostalCode { get; set; } = "";
    public bool IsDefault { get; set; } = false;
}