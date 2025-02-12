using System.Text;
using backend.Models;
using backend.Models.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<WebflowerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnectionString")));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };  
    });

// Đăng ký UploadImageFlower với DI container
builder.Services.AddScoped<UploadImageFlower>();


//builder.Services.AddControllers()
//       .AddJsonOptions(options =>
//       {
//           options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
//           options.JsonSerializerOptions.MaxDepth = 32; // This is optional, you can set it based on your needs.
//       });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});
//app.UseStaticFiles: Đây là một middleware trong ASP.NET Core dùng để phục vụ các tệp tĩnh như HTML, CSS, JavaScript, hình ảnh, v.v. Middleware này giúp trả về các tệp tĩnh theo yêu cầu của người dùng mà không cần xử lý logic bổ sung.
//new StaticFileOptions: Tạo một đối tượng StaticFileOptions để cấu hình cách mà các tệp tĩnh sẽ được phục vụ.
//PhysicalFileProvider được sử dụng để xác định thư mục vật lý trên máy chủ mà từ đó các tệp tĩnh sẽ được phục vụ.
//Path.Combine(builder.Environment.ContentRootPath, "UploadedFiles"): Hàm này kết hợp đường dẫn gốc của ứng dụng (ContentRootPath) với thư mục con "UploadedFiles" để chỉ định thư mục chứa các tệp mà bạn muốn phục vụ. Thư mục "UploadedFiles" nằm trong thư mục gốc của ứng dụng.
//RequestPath = "/UploadedFiles": Đây là đường dẫn URL mà người dùng có thể truy cập để yêu cầu các tệp trong thư mục "UploadedFiles". Khi người dùng truy cập vào /UploadedFiles, ứng dụng sẽ tìm kiếm và phục vụ tệp từ thư mục tương ứng trên máy chủ.
//Middleware này giúp phục vụ các tệp tĩnh từ thư mục "UploadedFiles" trong thư mục gốc của ứng dụng.
//Khi người dùng truy cập đường dẫn /UploadedFiles trong trình duyệt, ứng dụng sẽ trả về các tệp tương ứng từ thư mục "UploadedFiles" trên máy chủ.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(builder =>
{
    builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
});




app.Run();
