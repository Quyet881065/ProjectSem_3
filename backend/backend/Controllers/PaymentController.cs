using backend.Models.DTO;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Stripe;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly WebflowerContext _webflowerContext;

    public PaymentController(IConfiguration configuration, WebflowerContext webflowerContext)
    {
        _configuration = configuration;
        _webflowerContext = webflowerContext;
    }

    /// <summary>
    /// Tạo Stripe Checkout Session và trả về URL thanh toán
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] PaymentCreateRequest request)
    {
        // Lấy secret key từ cấu hình
        var secretKey = _configuration["Stripe:SecretKey"];
        StripeConfiguration.ApiKey = secretKey;

        // Tạo đối tượng Checkout Session
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            ClientReferenceId = request.OrderId.ToString(),
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Sample Product",
                        },
                        UnitAmount = (long)(request.Amount * 100), // Số tiền tính theo cent
                    },
                    Quantity = 1,
                },
            },
            Mode = "payment",
            SuccessUrl = $"{_configuration["Stripe:SuccessUrl"]}?session_id={{CHECKOUT_SESSION_ID}}",
            CancelUrl = _configuration["Stripe:CancelUrl"],
        };

        var service = new SessionService();
        Session session = await service.CreateAsync(options);

        var vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        // Sau khi tạo thành công phiên thanh toán, lưu thông tin ngay lập tức
        var payment = new Payment
        {
            Orderid = request.OrderId,
            PaymentMethod = "Payment Stripe",
            PaymentDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vietnamTimeZone),
            PaymentAmount = request.Amount,
            PaymentStatus = "Pending",  // Đặt trạng thái "Pending" cho đến khi thanh toán hoàn tất
            VnpayTransactionId = session.Id, // ID của phiên thanh toán (session ID)
            VnpayMessage = "Waiting for payment confirmation"
        };

        // Lưu thông tin thanh toán vào cơ sở dữ liệu
        _webflowerContext.Payments.Add(payment);
        await _webflowerContext.SaveChangesAsync();

        // Trả về URL của trang thanh toán
        return Ok(new { Url = session.Url });
    }

    /// <summary>
    /// Xác nhận kết quả thanh toán sau khi hoàn tất và cập nhật thông tin vào CSDL
    /// </summary>
    /// <param name="sessionId"></param>
    /// <returns></returns>
    [HttpGet("confirm-payment/{sessionId}")]
    public async Task<IActionResult> ConfirmPayment(string sessionId)
    {
        // Lấy secret key từ cấu hình
        var secretKey = _configuration["Stripe:SecretKey"];
        StripeConfiguration.ApiKey = secretKey;

        try
        {
            // Lấy chi tiết phiên thanh toán từ Stripe
            var service = new SessionService();
            Session session = await service.GetAsync(sessionId);

            if (session != null && session.PaymentStatus == "paid")
            {
                var orderId = int.Parse(session.ClientReferenceId);  // Assuming ClientReferenceId stores the orderId

                // Cập nhật trạng thái thanh toán trong CSDL
                var payment = await _webflowerContext.Payments.FirstOrDefaultAsync(p => p.VnpayTransactionId == session.Id);
                if (payment != null)
                {
                    payment.PaymentStatus = "Paid";
                    payment.VnpayResponseCode = "00";  // Assuming "00" means successful
                    payment.VnpayMessage = "Payment successful via Stripe";
                    await _webflowerContext.SaveChangesAsync();
                }

                // Cập nhật trạng thái đơn hàng (nếu cần)
                //var order = await _webflowerContext.Orders.FindAsync(orderId);
                //if (order != null)
                //{
                //    order.Status = "Paid";
                //    await _webflowerContext.SaveChangesAsync();
                //}

                return Ok(new { message = "Payment confirmed and updated in the database." });
            }

            return BadRequest(new { error = "Payment not completed or invalid session." });
        }
        catch (StripeException e)
        {
            // Trường hợp lỗi từ Stripe
            return BadRequest(new { error = e.Message });
        }
    }
}
