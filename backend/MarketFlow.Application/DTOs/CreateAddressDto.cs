namespace MarketFlow.Application.DTOs;

public class CreateAddressDto
{
    public string Title { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string City { get; set; } = null!;
    public string District { get; set; } = null!;
    public string FullAddress { get; set; } = null!;
    public string PostalCode { get; set; } = "";
    public bool IsDefault { get; set; }
}