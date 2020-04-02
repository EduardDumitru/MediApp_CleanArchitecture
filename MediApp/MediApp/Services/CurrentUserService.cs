using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using IdentityServer4.Extensions;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace MediApp.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            var id = httpContextAccessor.HttpContext?.User?.FindFirstValue("id");
            if (!string.IsNullOrEmpty(id))
            {
                UserId = long.Parse(id);
            }
        }

        public long? UserId { get; }
    }
}
