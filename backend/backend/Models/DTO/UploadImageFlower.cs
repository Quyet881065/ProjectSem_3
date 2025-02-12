namespace backend.Models.DTO
{
    public class UploadImageFlower
    {
        public readonly IWebHostEnvironment _webHostEnvironment;
        //Biến này được sử dụng để truy cập thông tin về môi trường hosting của ứng dụng (ví dụ: đường dẫn gốc của ứng dụng, thư mục web, v.v.). Nó được sử dụng để xác định đường dẫn vật lý trên máy chủ mà ứng dụng đang chạy.
        public UploadImageFlower(IWebHostEnvironment webHostEnvironment) {
          _webHostEnvironment = webHostEnvironment; 
        }
        public async Task<string> UploadImage(IFormFile imageFile)
        //IFormFile để đại diện cho các tệp tải lên từ các biểu mẫu HTML.
        {
            // Xử lý tên tệp
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            //Path.GetFileNameWithoutExtension(imagesFile.FileName): Lấy tên tệp ảnh mà không bao gồm phần mở rộng.
            //.Take(10): Chỉ lấy tối đa 10 ký tự từ tên tệp.
            //.ToArray(): Chuyển đổi chuỗi thành mảng ký tự.
            //.Replace(' ', '-'): Thay thế các khoảng trắng trong tên tệp thành dấu gạch ngang (-).

            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
            //DateTime.Now.ToString("yymmssfff"): Thêm chuỗi thời gian(năm, tháng, giây, mili giây) vào tên tệp để đảm bảo tên tệp là duy nhất và tránh trùng lặp.
            // Path.GetExtension(imagesFile.FileName): Lấy phần mở rộng của tệp ảnh(ví dụ: .png, .jpg).

            // Xác định đường dẫn lưu trữ (nơi lưu ảnh trên server)
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath,"Images" , imageName);
            //_webHostEnvironment.ContentRootPath: Lấy đường dẫn gốc của ứng dụng.
            //"Images": Đây là thư mục nơi tệp ảnh sẽ được lưu trữ.
            //imageName: Tên tệp ảnh vừa được tạo ra ở trên.
            //Path.Combine sẽ kết hợp các thành phần trên thành một đường dẫn đầy đủ, ví dụ: C:/YourApp/Images/tenfile-230115235501.png.

            // Lưu file lên server
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            //Sử dụng FileStream để tạo tệp mới tại đường dẫn vừa xác định (imagePath).
            //FileMode.Create: Nếu tệp đã tồn tại, nó sẽ bị ghi đè; nếu tệp chưa tồn tại, tệp mới sẽ được tạo.
            //imagesFile.CopyToAsync(fileStream): Tệp ảnh tải lên được sao chép vào luồng dữ liệu (fileStream) của tệp đích (lưu trên máy chủ).

            //Lớp UploadImageFlower có chức năng chính là nhận tệp ảnh từ người dùng, tạo ra một tên tệp mới duy nhất,
            //lưu tệp vào thư mục "Images" trong đường dẫn gốc của ứng dụng và trả về tên của tệp đã lưu.
            string relativeImagePath = $"/Images/{imageName}";
            return relativeImagePath;
        }
    }
}
