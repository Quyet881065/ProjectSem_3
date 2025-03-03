using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Models.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly WebflowerContext _context;

        public OrdersController(WebflowerContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var orders =  await _context.Orders
                .Include(o => o.DeliveryInfos)
                .Include(o => o.Payments)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var ordersWithDetails = orders.Select(order => new
            {
                OrderId = order.OrderId,
                DeliveryAddress = order.DeliveryAddress,
                Total = order.Total,
                Status = order.Status,
                OrderDate = order.OrderDate,
                DeliveryInfo = new
                {
                    RecipientPhoneNo = order.DeliveryInfos.FirstOrDefault()?.RecipientPhoneNo,
                    RecipientName = order.DeliveryInfos.FirstOrDefault()?.RecipientName
                },
                PaymentInfo = new
                {
                    PaymentMethod = order.Payments.FirstOrDefault()?.PaymentMethod,
                    PaymentDate = order.Payments.FirstOrDefault()?.PaymentDate
                }
            }).ToList();
            var totalOrders = orders.Count;
            return Ok(new
            {
                success = true,
                data = ordersWithDetails,
                totalOrders = totalOrders, // Trả về tổng số lượng đơn hàng
            });
        }

        [HttpGet("TotalOrders")]
        public async Task<ActionResult<int>> GetTotalOrders()
        {
            // Đếm số lượng đơn hàng
            var totalOrders = await _context.Orders.CountAsync();

            // Trả về tổng số lượng đơn hàng
            return Ok(new
            {
                success = true,
                totalOrders = totalOrders
            });
        }


        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.DeliveryInfos)  // Load dữ liệu từ bảng DeliveryInfo
                .Include(o => o.Payments)  // Load dữ liệu từ bảng Payment
                .Include(o => o.OrderDetails)     // Load dữ liệu từ bảng OrderDetail
                  .ThenInclude(od => od.Flower) // Load dữ liệu từ bảng Flower liên quan đến OrderDetail
                .Include(o => o.Occasion) // Load dữ liệu từ bảng Message (Occasion)
                .FirstOrDefaultAsync(o => o.OrderId == id);  // Tìm order theo ID


            if (order == null)
            {
                return NotFound();
            }

            // Lấy thông tin giao hàng đầu tiên (hoặc null nếu không có)
            var deliveryInfo = order.DeliveryInfos?.FirstOrDefault();
            var paymentInfo = order.Payments?.FirstOrDefault();

            // Tạo danh sách hoa từ OrderDetails
            var flowerDetails = order.OrderDetails.Select(od => new
            {
                od.FlowerId,
                FlowerName = od.Flower.FlowerName,
                od.Quantity,
                od.Price,
                Image = od.Flower.Image
            }).ToList();

            // Tạo object trả về bao gồm cả thông tin từ các bảng liên quan
            var orderWithDetails = new
            {
                OrderId = order.OrderId,
                DeliveryAddress = order.DeliveryAddress,
                Total = order.Total,
                Status = order.Status,
                OrderDate = order.OrderDate,
                DeliveryInfo = new
                {
                    RecipientPhoneNo = deliveryInfo?.RecipientPhoneNo,
                    RecipientName = deliveryInfo?.RecipientName,
                },
                PaymentInfo = new
                {
                    PaymentMethod = paymentInfo?.PaymentMethod,
                },
                Flowers = flowerDetails,
                Occasion = new
                {
                    OccasionName = order.Occasion?.OccasionName,
                    Message = order.Occasion?.Message1 // Lấy Message1 từ bảng Message (Occasion)
                }
            };

            return Ok( new
                {
                 success = true,
                data = orderWithDetails,
                });
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            if (id != order.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        // PUT: api/Orders/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] StatusUpdateModel statusUpdateModel)
        {
            // Tim don hang theo id
            var order = await _context.Orders.FindAsync(id);
            if(order == null)
            {
                return NotFound(new { success = false, message = "order not found" });
            }
            // Cap nhat trang thai don hang
            order.Status = statusUpdateModel.Status;

            try
            {
                // Luu thay doi vao csdl
                await _context.SaveChangesAsync();
            }catch(DbUpdateConcurrencyException)
            {
                if(!OrderExists(id))
                {
                    return NotFound(new { success = false, message = "order not found" });
                }
                else
                {
                    throw;
                }
            }
            return Ok(new
            {
                success = true,
                message = "order status updated successfully"
            });
        }


        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.OrderId }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            // Xóa tất cả các bản ghi liên quan trong bảng payment
            var relatedPayments = _context.Payments.Where(p => p.Orderid == id);
            if (relatedPayments.Any())
            {
                _context.Payments.RemoveRange(relatedPayments);
            }

            // Xóa tất cả các bản ghi liên quan trong bảng orderDetails
            var relatedOrderDetails = _context.OrderDetails.Where(od => od.Orderid == id);
            if (relatedOrderDetails.Any())
            {
                _context.OrderDetails.RemoveRange(relatedOrderDetails);
            }

            // Xóa tất cả các bản ghi liên quan trong bảng deliveryInfo trước khi xóa đơn hàng
            var relatedDeliveries = _context.DeliveryInfos.Where(di => di.Orderid == id);
            if (relatedDeliveries.Any())
            {
                _context.DeliveryInfos.RemoveRange(relatedDeliveries);
            }


            // Sau đó, xóa đơn hàng
            _context.Orders.Remove(order);

            // Lưu thay đổi
            await _context.SaveChangesAsync();

            return Ok(new {success= true});
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.OrderId == id);
        }
    }
}
