using System.Globalization;
using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;
using MarketFlow.Domain.Entities;
using Microsoft.Extensions.Options;

using DomainAddress = MarketFlow.Domain.Entities.Address;
using IyzicoAddress = Iyzipay.Model.Address;
using IyzicoOptions = Iyzipay.Options;

namespace MarketFlow.Infrastructure.Payments.Iyzico;

public class IyzicoPaymentService
{
    private readonly IyzicoSettings _settings;

    public IyzicoPaymentService(IOptions<IyzicoSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task<CheckoutFormInitialize> InitializeCheckoutFormAsync(
        Order order,
        AppUser user,
        DomainAddress address)
    {
        var options = new IyzicoOptions
        {
            ApiKey = _settings.ApiKey,
            SecretKey = _settings.SecretKey,
            BaseUrl = _settings.BaseUrl
        };

        var request = new CreateCheckoutFormInitializeRequest
        {
            Locale = Locale.TR.ToString(),
            ConversationId = Guid.NewGuid().ToString(),
            Price = order.TotalPrice.ToString("0.00", CultureInfo.InvariantCulture),
            PaidPrice = order.TotalPrice.ToString("0.00", CultureInfo.InvariantCulture),
            Currency = Currency.TRY.ToString(),
            BasketId = order.Id.ToString(),
            PaymentGroup = PaymentGroup.PRODUCT.ToString(),
            CallbackUrl = _settings.CallbackUrl,
            EnabledInstallments = new List<int> { 1 }
        };

        request.Buyer = new Buyer
        {
            Id = user.Id.ToString(),
            Name = user.FullName,
            Surname = "-",
            Email = user.Email,
            IdentityNumber = "11111111111",
            RegistrationAddress = address.FullAddress,
            City = address.City,
            Country = "Turkey",
            ZipCode = string.IsNullOrWhiteSpace(address.PostalCode) ? "27000" : address.PostalCode,
            Ip = "127.0.0.1"
        };

        request.ShippingAddress = new IyzicoAddress
        {
            ContactName = address.FullName,
            City = address.City,
            Country = "Turkey",
            Description = address.FullAddress,
            ZipCode = string.IsNullOrWhiteSpace(address.PostalCode) ? "27000" : address.PostalCode
        };

        request.BillingAddress = new IyzicoAddress
        {
            ContactName = address.FullName,
            City = address.City,
            Country = "Turkey",
            Description = address.FullAddress,
            ZipCode = string.IsNullOrWhiteSpace(address.PostalCode) ? "27000" : address.PostalCode
        };

        request.BasketItems = order.Items.Select(i => new BasketItem
        {
            Id = i.ProductId.ToString(),
            Name = i.ProductName,
            Category1 = "General",
            ItemType = BasketItemType.PHYSICAL.ToString(),
            Price = i.TotalPrice.ToString("0.00", CultureInfo.InvariantCulture)
        }).ToList();

        var result = await CheckoutFormInitialize.Create(request, options);
        return result;
    }

    public async Task<CheckoutForm> RetrieveCheckoutFormAsync(string token)
    {
        var options = new IyzicoOptions
        {
            ApiKey = _settings.ApiKey,
            SecretKey = _settings.SecretKey,
            BaseUrl = _settings.BaseUrl
        };

        var request = new RetrieveCheckoutFormRequest
        {
            Locale = Locale.TR.ToString(),
            ConversationId = Guid.NewGuid().ToString(),
            Token = token
        };

        var result = await CheckoutForm.Retrieve(request, options);
        return result;
    }
}