using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public partial class Flower
{
    public int? FlowerId { get; set; }

    public string? FlowerName { get; set; }

    public decimal? Price { get; set; }

    public string? Category { get; set; }

    public bool? Bestseller { get; set; }

    [NotMapped]
    public IFormFile? ImageFile { get; set; }

    public string? Image { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<Cart>? Carts { get; set; } = new List<Cart>();

    public virtual ICollection<OrderDetail>? OrderDetails { get; set; } = new List<OrderDetail>();
}
