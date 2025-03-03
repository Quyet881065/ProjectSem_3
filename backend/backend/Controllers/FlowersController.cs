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
    public class FlowersController : ControllerBase
    {
        private readonly WebflowerContext _flowerContext;
        private readonly UploadImageFlower _uploadImageFlower;

        public FlowersController(WebflowerContext context, UploadImageFlower uploadImageFlower)
        {
            _flowerContext = context;
            _uploadImageFlower = uploadImageFlower;
        }

        // GET: api/Flowers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flower>>> GetFlowers()
        {
            try
            {
                var flowers = await _flowerContext.Flowers.ToListAsync();
                var baseUrl = $"{Request.Scheme}://{Request.Host}/Images/";
                foreach (var flower in flowers)
                {
                    if (!string.IsNullOrEmpty(flower.Image) && !flower.Image.StartsWith("https://"))
                    {
                        // Kiểm tra xem đường dẫn ảnh đã có sẵn URL cơ sở hay chưa, nếu chưa thì thêm vào
                        flower.Image = baseUrl + flower.Image;
                    }
                }

                // Trả về danh sách hoa đã được cập nhật đường dẫn ảnh
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

        [HttpGet("TotalFlower")]
        public async Task<ActionResult<int>> GetTotalFlower()
        { 
          // dem so luong flower
          var totalFlower = await _flowerContext.Flowers.CountAsync();

            // tra ve tong so luong flower
            return Ok(new
            {
                success = true,
                totalFlower
            });
        }

        // GET: api/Flowers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Flower>> GetFlower(int id)
        {
            var flower = await _flowerContext.Flowers.FindAsync(id);

            if (flower == null)
            {
                return NotFound();
            }

            return Ok(new {success = true , flower = flower});
        }

        // PUT: api/Flowers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFlower(int id, [FromForm] Flower flower)
        {
            if (id != flower.FlowerId)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "FlowerId in URL and body do not match."
                });
            }

            var existingFlower = await _flowerContext.Flowers.FindAsync(id);
            if (existingFlower == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Flower not found."
                });
            }
           
            // Nếu có tệp hình ảnh được tải lên, tải tệp và cập nhật đường dẫn ảnh
            if (flower.ImageFile != null)
            {
                // Upload hình ảnh mới
                string flowerImagePath = await _uploadImageFlower.UploadImage(flower.ImageFile);
                // Chỉ lưu tên file, không lưu base URL
                flower.Image = Path.GetFileName(flowerImagePath);

                // Lấy URL cơ sở (base URL)
                var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";

                // Kết hợp base URL với đường dẫn ảnh và lưu vào Image
                flower.Image = $"{baseUrl}/Images/{flower.Image}";
            }   

            // Cập nhật các thông tin khác
            existingFlower.FlowerName = flower.FlowerName;
            existingFlower.Description = flower.Description;
            existingFlower.Price = flower.Price;
            existingFlower.Category = flower.Category;
            existingFlower.Bestseller = flower.Bestseller;
            existingFlower.Image = flower.Image;

            _flowerContext.Entry(existingFlower).State = EntityState.Modified;

            try
            {
                await _flowerContext.SaveChangesAsync();
                return Ok(new
                {
                    success = true,
                    message = "Flower updated successfully.",
                    imageUrl = existingFlower.Image  // Trả về URL đầy đủ của ảnh
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlowerExists(id))
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Flower does not exist."
                    });
                }
                else
                {
                    throw;
                }
            }
        }




        // POST: api/Flowers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Flower>> PostFlower([FromForm] Flower flower)
        {
            if(flower == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Flower data is null"
                });
            }

            // Gán đường dẫn mặc định nếu Image không có sẵn
            //Toán tử ?? trong C# dùng để kiểm tra xem giá trị bên trái có null hay không
            string flowerImagePath = flower.Image ?? "default_image";

             // Nếu có tệp hình ảnh được tải lên, tải tệp và cập nhật đường dẫn ảnh
            if (flower.ImageFile != null)
            {
                flowerImagePath = await _uploadImageFlower.UploadImage(flower.ImageFile);
                flower.Image = flowerImagePath;
            }

            // Lấy URL cơ sở (base URL)
            var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
            flower.Image = $"{baseUrl}{flower.Image}"; // Kết hợp base URL với đường dẫn ảnh

            _flowerContext.Flowers.Add(flower);
            await _flowerContext.SaveChangesAsync();

            //return CreatedAtAction("GetFlower", new { id = flower.FlowerId }, flower);
            return Ok(new
            {
                success = true,
                message = "Add successfull",
                data = flower
            });
        }

        // DELETE: api/Flowers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlower(int id)
        {
            var flower = await _flowerContext.Flowers.FindAsync(id);
            if (flower == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Flower not found"
                });
            }

            // Xóa các mục liên quan trong bảng Cart trước khi xóa bông hoa
            var cartsWithFlower = _flowerContext.Carts.Where(c => c.FlowerId == id);
            _flowerContext.Carts.RemoveRange(cartsWithFlower);

            // Xóa bông hoa
            _flowerContext.Flowers.Remove(flower);
            await _flowerContext.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Flower and related cart items deleted successfully"
            });
        }


        private bool FlowerExists(int id)
        {
            return _flowerContext.Flowers.Any(e => e.FlowerId == id);
        }
    }
}
