using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Payment
{
    public int Paymentid { get; set; }

    public int? Orderid { get; set; }

    public string? PaymentMethod { get; set; }

    public DateTime? PaymentDate { get; set; }

    public decimal? PaymentAmount { get; set; }

    public string? PaymentStatus { get; set; }

    public string? VnpayTransactionId { get; set; }

    public string? VnpayResponseCode { get; set; }

    public string? VnpayMessage { get; set; }

    public virtual Order? Order { get; set; }
}
