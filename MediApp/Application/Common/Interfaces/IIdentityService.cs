using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Application.Common.Models;

namespace Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<string> GetUserNameAsync(long userId);

        Task<(Result Result, long UserId)> CreateUserAsync(string userName, string password);

        Task<Result> DeleteUserAsync(long userId);
    }
}
