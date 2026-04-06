namespace MarketFlow.Infrastructure.Payments.Iyzico;

public class IyzicoSettings
{
    public string ApiKey { get; set; } = null!;
    public string SecretKey { get; set; } = null!;
    public string BaseUrl { get; set; } = null!;
    public string CallbackUrl { get; set; } = null!;
}