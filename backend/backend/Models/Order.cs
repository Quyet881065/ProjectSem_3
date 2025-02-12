using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public string? DeliveryAddress { get; set; }

    public decimal? Total { get; set; }

    public string? Status { get; set; }

    public DateTime? OrderDate { get; set; }

    public int? CustomerId { get; set; }

    public int? Occasionid { get; set; }

    public int? CartId { get; set; }

    public virtual Cart? Cart { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<DeliveryInfo> DeliveryInfos { get; set; } = new List<DeliveryInfo>();

    public virtual Message? Occasion { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
