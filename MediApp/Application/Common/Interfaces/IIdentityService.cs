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

        Task<(Result Result, long UserId)> CreateUserAsync(string userName, string password,
            string firstName, string lastName,
            string streetNo, string cnp, string phoneNumber, short countryId, int countyId, int cityId,
            short genderId, string middleName = null, string address = null, string streetName = null);

        Task<Result> CreateRoleAsync(string name);
        Task<Result> AddToRoleAsync(long userId, string role);
        Task<bool> RoleExistsAsync(string role);
        Task<long?> GetUserIdAsync(string email);
    }
}
