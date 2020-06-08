using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class ApplicationRole : IdentityRole<long>
    {
        public ApplicationRole(string name) : base(name)
        {
        }

        public ApplicationRole()
        {
        }
    }
}