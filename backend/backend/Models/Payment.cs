using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Payment
{
    public int Paymentid { get; set; }

    public int? Orderid { get; set; }

    public string? PaymentMethod { get; set; }

    public DateOnly? PaymentDate { get; set; }

    public decimal? PaymentAmount { get; set; }

    public string? PaymentStatus { get; set; }

    public virtual Order? Order { get; set; }
}
