using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Message
{
    public int Occasionid { get; set; }

    public string? OccasionName { get; set; }

    public string? Message1 { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
