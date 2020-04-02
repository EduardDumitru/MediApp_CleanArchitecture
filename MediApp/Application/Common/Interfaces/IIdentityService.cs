using System.Threading.Tasks;
using Application.Common.Models;
using Application.Users.Commands.User.AddUser;
using Application.Users.Commands.User.LoginUser;

namespace Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<string> GetUserNameAsync(long userId);

        Task<Result> DeleteUserAsync(long userId);

        Task<Result> CreateRoleAsync(string name);
        Task<Result> AddToRoleAsync(long userId, string role);
        Task<bool> RoleExistsAsync(string role);
        Task<long?> GetUserIdAsync(string email);
        Task<AuthenticationResult> LoginAsync(LoginUserCommand loginUser);
        Task<AuthenticationResult> RegisterAsync(AddUserCommand userToAdd);
        Task<(Result, long UserId)> CreateUserSeedAsync(AddUserCommand userToAdd);
    }
}
