using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser<long>
    {
        public bool? IsActive { get; set; }
    }
}