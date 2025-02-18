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
                }
            }).ToList();
            return Ok(new
            {
                success = true,
                data = ordersWithDetails
            });
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.DeliveryInfos)  // Load dữ liệu từ bảng DeliveryInfo
                .Include(o => o.Payments)  // Load dữ liệu từ bảng Payment
                .FirstOrDefaultAsync(o => o.OrderId == id);  // Tìm order theo ID


            if (order == null)
            {
                return NotFound();
            }

            // Lấy thông tin giao hàng đầu tiên (hoặc null nếu không có)
            var deliveryInfo = order.DeliveryInfos?.FirstOrDefault();
            var paymentInfo = order.Payments?.FirstOrDefault();

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
                },
                PaymentInfo = new
                {
                    PaymentMethod = paymentInfo?.PaymentMethod,
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


            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.OrderId == id);
        }
    }
}
