using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class DeliveryInfo
{
    public int Deliveryid { get; set; }

    public int? Orderid { get; set; }

    public string? RecipientName { get; set; }

    public string? RecipientAddress { get; set; }

    public string? RecipientPhoneNo { get; set; }

    public DateOnly? DeliveryDate { get; set; }

    public virtual Order? Order { get; set; }
}
