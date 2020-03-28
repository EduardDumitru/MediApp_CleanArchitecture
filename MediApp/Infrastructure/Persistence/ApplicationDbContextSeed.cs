using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Common.Constants;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Persistence
{
    public static class ApplicationDbContextSeed
    {
        public static async Task SeedAsync(RoleManager<ApplicationRole> roleManager)
        {
            if (!await roleManager.RoleExistsAsync(RoleConstants.Admin))
            {
                await roleManager.CreateAsync(new ApplicationRole(RoleConstants.Admin));
            }

            if (!await roleManager.RoleExistsAsync(RoleConstants.Nurse))
            {
                await roleManager.CreateAsync(new ApplicationRole(RoleConstants.Nurse));
            }

            if (!await roleManager.RoleExistsAsync(RoleConstants.Doctor))
            {
                await roleManager.CreateAsync(new ApplicationRole(RoleConstants.Doctor));
            }

            if (!await roleManager.RoleExistsAsync(RoleConstants.User))
            {
                await roleManager.CreateAsync(new ApplicationRole(RoleConstants.User));
            }
        }
    }
}
