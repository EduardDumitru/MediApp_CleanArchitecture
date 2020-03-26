using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
