using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class OrderDetail
{
    public int Orderdetailid { get; set; }

    public int? Orderid { get; set; }

    public int? FlowerId { get; set; }

    public int? Quantity { get; set; }

    public decimal? Price { get; set; }

    public virtual Flower? Flower { get; set; }

    public virtual Order? Order { get; set; }
}
