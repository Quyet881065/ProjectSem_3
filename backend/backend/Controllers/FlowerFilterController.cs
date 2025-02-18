using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlowerFilterController : ControllerBase
    {
        private readonly WebflowerContext _context;

        public FlowerFilterController(WebflowerContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flower>>> GetFlowers([FromQuery] string flowerName = "", [FromQuery] string category = "", [FromQuery] string sort = "relevant")
        {
            try
            {
                // Lấy danh sách các hoa từ cơ sở dữ liệu
                var flowersQuery = _context.Flowers.AsQueryable();

                // Nếu có tham số flowerName, lọc theo tên hoa
                if (!string.IsNullOrEmpty(flowerName))
                {
                    flowersQuery = flowersQuery.Where(f => f.FlowerName.ToLower().Contains(flowerName.ToLower()));
                }

                // Nếu có tham số category, lọc theo danh mục
                if (!string.IsNullOrEmpty(category))
                {
                    flowersQuery = flowersQuery.Where(f => f.Category.ToLower() == category.ToLower());
                }

                // Xử lý tham số sort
                switch (sort.ToLower())
                {
                    case "lowtohigh":
                        flowersQuery = flowersQuery.OrderBy(f => f.Price);
                        break;
                    case "hightolow":
                        flowersQuery = flowersQuery.OrderByDescending(f => f.Price);
                        break;
                    default:
                        // Nếu không có sắp xếp cụ thể, giữ nguyên (relevant)
                        break;
                }

                // Chuyển đổi sang danh sách
                var flowers = await flowersQuery.ToListAsync();

                // Thêm URL cơ sở vào hình ảnh nếu thiếu
                var baseUrl = $"{Request.Scheme}://{Request.Host}/Images/";
                foreach (var flower in flowers)
                {
                    if (!string.IsNullOrEmpty(flower.Image) && !flower.Image.StartsWith("https://"))
                    {
                        flower.Image = baseUrl + flower.Image;
                    }
                }

                // Trả về kết quả
                return Ok(new
                {
                    success = true,
                    flowers = flowers
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Có lỗi xảy ra khi lấy danh sách hoa.",
                    error = ex.Message
                });
            }
        }
    }
}
