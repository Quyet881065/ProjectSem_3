namespace backend.Models.DTO
{
    public class PaymentCreateRequest
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
    }
}
