namespace backend.Models.DTO
{
    public class ForgotPasswordDTO
    {
        public string Email {  get; set; }
        public string? NewPassword { get; set; }
        public string? ConfirmNewPassword { get; set; }
    }
}
