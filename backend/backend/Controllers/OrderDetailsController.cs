using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly WebflowerContext _context;

        public OrderDetailsController(WebflowerContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetails
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetOrderDetails(int customerId)
        {
            var orderDetails = await _context.OrderDetails
                 .Where(od => od.Order.CustomerId == customerId)  
                .Include(od => od.Flower)
                .Include(od => od.Order)
                .ThenInclude(o => o.DeliveryInfos)
                .Select(od => new
                {
                    Orderdetailid = od.Orderdetailid,
                    Orderid = od.Orderid,
                    FlowerId = od.FlowerId,
                    Quantity = od.Quantity,
                    Price = od.Price,
                    // Chỉ lấy các trường cần thiết từ Flower và Order
                    FlowerName = od.Flower.FlowerName,
                    FlowerPrice = od.Flower.Price,
                    FlowerImage = od.Flower.Image,
                    DeliveryAddress = od.Order.DeliveryAddress,
                    Total = od.Order.Total,
                    Status = od.Order.Status,
                    // Lấy số điện thoại của người nhận từ DeliveryInfos (lấy thông tin đầu tiên nếu có)
                    RecipientPhone = od.Order.DeliveryInfos.FirstOrDefault().RecipientPhoneNo
                })
                .ToListAsync();

            return Ok(new { success = true, orderdata = orderDetails });
        }

        // GET: api/OrderDetails/5
        [HttpGet("{orderDetailId}")]
        public async Task<ActionResult<OrderDetail>> GetOrderDetail(int orderDetailId)
        {
            var orderDetail = await _context.OrderDetails
                .Where(od => od.Orderdetailid == orderDetailId)
                //.Where(od => od.Orderdetailid == id): Lọc những OrderDetails có Orderdetailid khớp với id được truyền vào
                .Include(od => od.Order)
                //  Gồm thông tin liên quan từ bảng Order. Thao tác này thực hiện "eager loading" (tải trước dữ liệu liên quan),
                // có nghĩa là lấy thông tin từ bảng Order liên quan đến OrderDetails ngay lập tức khi thực thi truy vấn.
                .ThenInclude(o => o.DeliveryInfos) // Thêm để lấy thông tin DeliveryInfo
                // Sau khi bao gồm bảng Order, cũng lấy luôn dữ liệu từ bảng DeliveryInfos,
                //là bảng có quan hệ với Order. Điều này giúp lấy thông tin liên quan đến giao hàng
                .Include(od => od.Flower)
                .Include(od => od.Order.Occasion)

                .Include(od => od.Order.Payments)
                // Bao gồm bảng Payments, cho phép lấy thông tin về các khoản thanh toán liên quan đến đơn hàng.
                .Select(od => new
                {
                    Status = od.Order.Status,
                    Total = od.Order.Total,
                    Address = od.Order.DeliveryAddress,
                    OrderDate = od.Order.OrderDate,
                    FlowerName = od.Flower.FlowerName,
                    FlowerImage = od.Flower.Image,
                    Quantity = od.Quantity,
                    Price = od.Price,
                    RecipientName = od.Order.DeliveryInfos.Select(di => di.RecipientName).FirstOrDefault(),  // Lấy RecipientName
                    RecipientAddress = od.Order.DeliveryInfos.Select(di => di.RecipientAddress).FirstOrDefault(),
                    RecipientPhone = od.Order.DeliveryInfos.Select(di => di.RecipientPhoneNo).FirstOrDefault(),
                    Message = od.Order.Occasion.Message1,
                    PaymentMethod = od.Order.Payments.Select(p => p.PaymentMethod).FirstOrDefault()
                    // Lấy phương thức thanh toán (PaymentMethod) từ bảng Payments. Nếu có nhiều phương thức thanh toán,
                    // chỉ lấy phương thức đầu tiên bằng cách sử dụng FirstOrDefault().
                })
                .FirstOrDefaultAsync();

            if (orderDetail == null)
            {
                return NotFound();
            }

            return Ok(new {success= true, data = orderDetail});
        }

        // PUT: api/OrderDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderDetail(int id, OrderDetail orderDetail)
        {
            if (id != orderDetail.Orderdetailid)
            {
                return BadRequest();
            }

            _context.Entry(orderDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderDetailExists(id))
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

        // POST: api/OrderDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderDetail>> PostOrderDetail(List<OrderDetail> orderDetail)
        {
            if(orderDetail == null)
            {
                return BadRequest(new { success = false, message = "No order details provided." });
            }
            try
            {
                foreach (var detail in orderDetail)
                {
                    _context.OrderDetails.Add(detail);
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Order details saved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while saving the order details.", error = ex.Message });
            }
        }

        // DELETE: api/OrderDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);
            if (orderDetail == null)
            {
                return NotFound();
            }

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderDetailExists(int id)
        {
            return _context.OrderDetails.Any(e => e.Orderdetailid == id);
        }
    }
}
