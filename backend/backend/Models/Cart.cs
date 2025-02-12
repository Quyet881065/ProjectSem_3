using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Cart
{
    public int CartId { get; set; }

    public int? UserId { get; set; }

    public int? FlowerId { get; set; }

    public int? Quantity { get; set; }

    public DateTime? DateAdded { get; set; }

    public virtual Flower? Flower { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual User? User { get; set; }
}
