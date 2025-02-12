using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using backend.Models;
using backend.Models.DTO;
using BCrypt.Net;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly WebflowerContext _webflowerContext;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        public AuthController(WebflowerContext webflowerContext, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _webflowerContext = webflowerContext;
            _configuration = configuration;
            _logger = logger;

            _smtpServer = _configuration["Email:SmtpServer"];
            _smtpPort = int.Parse(_configuration["Email:SmtpPort"]);
            _smtpUsername = _configuration["Email:SmtpUser"];
            _smtpPassword = _configuration["Email:SmtpPassword"];
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterDTO registerDTO)
        {
            // Kiem tra email da ton tai chua
            var existingUser = await _webflowerContext.Users.FirstOrDefaultAsync(user => user.Email == registerDTO.Email);
            if (existingUser != null)
            {
                return BadRequest(new { success = false, message = "Email already exists" });
            }
            // Ma hoa mat khau
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password);

            // Tao nguoi dung moi
            var newUser = new User
            {
                Username = registerDTO.UserName,
                Email = registerDTO.Email,
                Password = hashedPassword,
            };
            _webflowerContext.Users.Add(newUser);
            await _webflowerContext.SaveChangesAsync();

            // Tao khach hang moi 
            var newCustomer = new Customer
            {
                FullName = registerDTO.FullName,
                Email = registerDTO.Email,
                Gender = registerDTO.Gender,
                Address = registerDTO.Address,
                Phone = registerDTO.Phone,
                UserId = newUser.UserId // Foreign key to User table( Khoa ngoai cho bang nguoi dung)
            };
            _webflowerContext.Customers.Add(newCustomer);
            await _webflowerContext.SaveChangesAsync();

            // Tao JWT token 
            var token = GenerateJwtToken(newUser.Email);
            return Ok(new
            {
                success = true,
                message = "Registration successful",
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                //token.ValidTo: Trả về thời gian hết hạn của token.
                data = new
                {
                    newCustomer.FullName,
                    newCustomer.Email,
                    newCustomer.Address,
                    newCustomer.Phone
                    // Avoid returning User reference that causes the cycle
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            var account = await _webflowerContext.Users.FirstOrDefaultAsync(user => user.Email == loginDTO.Email);
            if (account == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Password, account.Password))
            {
                _logger.LogWarning("Invalid credentials for email {Email}", loginDTO.Email);
                return Ok(new { success = false, message = "Thong tin dang nhap khong chinh xac" });
            }

            // Tìm `customerId` tương ứng với `UserId`
            var customer = await _webflowerContext.Customers
                .Where(c => c.UserId == account.UserId)
                .Select(c => new {c.CustomerId})
                .FirstOrDefaultAsync();


            var token = GenerateJwtToken(loginDTO.Email);
            return Ok(new
            {
                success = true,
                message = "Dang nhap thanh cong",
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                userId = account.UserId,
                role = account.Role,
                customerId = customer?.CustomerId ?? null // Trả về `customerId`, nếu không có thì null
            });
        }

        [HttpPost("login/admin")]
        public async Task<IActionResult> LoginAdmin(LoginDTO loginDTO)
        {
            var account = await _webflowerContext.Users.FirstOrDefaultAsync(user => user.Email ==  loginDTO.Email);
            if (account == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Password, account.Password))
            {
                _logger.LogWarning("Invalid credentials for email {Email}", loginDTO.Email);
                return Ok(new { success = false, message = "Thong tin dang nhap khong chinh xac" });
            }
            // Kiem tra role nguoi dung
            if(account.Role != "admin")
            {
                _logger.LogWarning("Unauthorized admin login attempt by user {Email}", loginDTO.Email);
                return Ok(new { success = false, message = "Chi admin moi co quyen dang nhap" });
            }
            // Tạo token JWT
            var token = GenerateJwtToken(loginDTO.Email);
            return Ok(new
            {
                success = true,
                message = "Dang nhap thanh cong",
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                userId = account.UserId,
                role = account.Role
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDTO forgotPasswordDTO)
        {
            // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có trùng khớp không
            if (forgotPasswordDTO.NewPassword != forgotPasswordDTO.ConfirmNewPassword)
            {
                return BadRequest(new { success = false, message = "Mật khẩu xác nhận không trùng khớp với mật khẩu mới." });
            }

            // Giả sử rằng bạn có một phương thức để lấy người dùng hiện tại hoặc dựa trên email/số điện thoại
            var user = await _webflowerContext.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDTO.Email); // Ví dụ lấy người dùng qua email

            if (user == null)
            {
                return BadRequest(new { success = false, message = "Người dùng không tồn tại." });
            }

            //Hash mat khau moi
            user.Password = BCrypt.Net.BCrypt.HashPassword(forgotPasswordDTO.NewPassword);

            try
            {
                // Luu mat khau moi vao csdl
                _webflowerContext.Users.Update(user);
                await _webflowerContext.SaveChangesAsync();
            }
            catch (Exception ex){
                _logger.LogError(ex, "Lỗi khi cập nhật mật khẩu cho người dùng {Email}", user.Email);
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình cập nhật mật khẩu" });
            }

            // Gửi email xác nhận (tuỳ chọn)
            // await _emailService.SendPasswordResetConfirmationEmail(user.Email);

            return Ok(new {success = true, message = "Cập nhật mật khẩu thành công." });
        }


        [HttpPost("request-change-password")]
        public async Task<IActionResult> RequestChangePassword (ForgotPasswordDTO forgotPasswordDTO)
        {
            var user = await _webflowerContext.Users.SingleOrDefaultAsync(u => u.Email == forgotPasswordDTO.Email);
            if (user == null)
            {
                return BadRequest(new { success = false, message = "Email khong ton tai" }); 
            }
            // Gửi email có link đổi mật khẩu 
            var resetLink = $"http://localhost:5173/forgot-password";
            await SendEmailAsync(user.Email, "Yeu cau dat lai mat khau", $"Vui lòng nhấp vào link sau để đat lai mật khẩu:{resetLink}");
            return Ok(new { success = true, message = "Vui lòng nhấp vào email sau để dat lai mật khẩu:" });
            }


        // Tao JWT token 
        private JwtSecurityToken GenerateJwtToken(string email)
        {
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            //authClaims chứa các thông tin về người dùng mà bạn muốn đưa vào trong token, như email và ID duy nhất của token.
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSecretKeyHereYourSecretKeyHere"));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );
            return token;
        }

        // gửi email thông qua SMTP server bằng cách sử dụng thư viện MailKit.
        private async Task SendEmailAsync(string toEmail, string subject, string body)
        // Kiểu trả về Task của phương thức này biểu thị rằng hàm sẽ hoàn thành một tác vụ bất đồng bộ (gửi email) nhưng không trả về dữ liệu, chỉ thông báo khi nào nó kết thúc.
        {
            var emailMessage = new MimeMessage();
            // MimeMessage: Đối tượng chứa các thông tin của email như người gửi, người nhận, tiêu đề và nội dung.
            emailMessage.From.Add(new MailboxAddress("Flower App", _smtpUsername));
            emailMessage.To.Add(new MailboxAddress(toEmail, toEmail));
            emailMessage.Subject = subject;
            var bodyBuilder = new BodyBuilder
            {
                TextBody = body
            };
            //BodyBuilder: Dùng để xây dựng phần nội dung của email.
            emailMessage.Body = bodyBuilder.ToMessageBody();
            using (var smtpClient = new MailKit.Net.Smtp.SmtpClient())
            //Tạo một đối tượng SmtpClient để gửi email qua SMTP.
            {
                await smtpClient.ConnectAsync(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
                // Kết nối tới server SMTP, sử dụng server và port được cung cấp qua _smtpServer và _smtpPort. SecureSocketOptions.StartTls là tùy chọn bảo mật cho việc mã hóa kết nối.
                await smtpClient.AuthenticateAsync(_smtpUsername, _smtpPassword);
                // Xác thực với server SMTP bằng cách sử dụng tên đăng nhập (_smtpUser) và mật khẩu (_smtpPassword).
                await smtpClient.SendAsync(emailMessage);
                //Gửi email.
                await smtpClient.DisconnectAsync(true);
                //Ngắt kết nối với server sau khi gửi thành công.
            }
        }
    }
}
