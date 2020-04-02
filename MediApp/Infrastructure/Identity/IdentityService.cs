using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Constants;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public IdentityService(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager,
            IHttpContextAccessor httpContextAccessor,
            ApplicationDbContext context, JwtSettings jwtSettings)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _jwtSettings = jwtSettings;
        }

        public async Task<string> GetUserNameAsync(long userId)
        {
            var user = await _userManager.Users.FirstAsync(u => u.Id == userId);

            return user.UserName;
        }

        public async Task<Result> CreateRoleAsync(string name)
        {
            var result = await _roleManager.CreateAsync(new ApplicationRole(name));
            return (result.ToApplicationResult());
        }

        public async Task<Result> AddToRoleAsync(long userId, string role)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
            var result = await _userManager.AddToRoleAsync(user, role);

            return result.ToApplicationResult();
        }

        public async Task<Result> DeleteUserAsync(long userId)
        {
            var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);
            
            if (user != null)
            {
                user.IsActive = false;
                return await DeleteUserAsync(user);
            }

            return Result.Success();
        }

        private async Task<Result> DeleteUserAsync(ApplicationUser user)
        {
            var result = await _userManager.UpdateAsync(user);

            return result.ToApplicationResult();
        }

        public async Task<bool> RoleExistsAsync(string role)
        {
            return await _roleManager.RoleExistsAsync(role);
        }

        public async Task<long?> GetUserIdAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            return user?.Id;
        }

        public async Task<(Result, long UserId)> CreateUserSeedAsync(AddUserCommand userToAdd)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = new ApplicationUser
                {
                    UserName = userToAdd.Email,
                    Email = userToAdd.Email
                };

                var result = await _userManager.CreateAsync(user, userToAdd.Password);

                await _userManager.AddToRoleAsync(user, RoleConstants.User);

                var userProfile = new UserProfile
                {
                    FirstName = userToAdd.FirstName,
                    MiddleName = userToAdd.MiddleName,
                    LastName = userToAdd.LastName,
                    Address = userToAdd.Address,
                    StreetName = userToAdd.StreetName,
                    StreetNo = userToAdd.StreetNo,
                    CNP = userToAdd.CNP,
                    CountryId = userToAdd.CountryId,
                    CountyId = userToAdd.CountyId,
                    CityId = userToAdd.CityId,
                    GenderId = userToAdd.GenderId,
                    EmailAddress = userToAdd.Email,
                    PhoneNumber = userToAdd.PhoneNumber,
                    UserId = user.Id
                };

                await _context.AddAsync(userProfile);

                await _context.SaveChangesAsync();

                // Commit transaction if all commands succeed, transaction will auto-rollback
                // when disposed if either commands fails
                await transaction.CommitAsync();

                return (result.ToApplicationResult(), user.Id);
            }
            catch (Exception e)
            {
                await transaction.RollbackAsync();

                throw new Exception(e.ToString());
            }
        }

        public async Task<AuthenticationResult> RegisterAsync(AddUserCommand userToAdd)
        {
            var existingUser = await _userManager.FindByEmailAsync(userToAdd.Email);

            if (existingUser != null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User with this email address already exists" }
                };
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = new ApplicationUser
                {
                    UserName = userToAdd.Email,
                    Email = userToAdd.Email,
                    PhoneNumber = userToAdd.PhoneNumber,

                };

                var createdUser = await _userManager.CreateAsync(user, userToAdd.Password);

                if (!createdUser.Succeeded)
                {
                    return new AuthenticationResult
                    {
                        Errors = createdUser.Errors.Select(x => x.Description)
                    };
                }

                await _userManager.AddToRoleAsync(user, RoleConstants.User);

                var userProfile = new UserProfile
                {
                    FirstName = userToAdd.FirstName,
                    MiddleName = userToAdd.MiddleName,
                    LastName = userToAdd.LastName,
                    Address = userToAdd.Address,
                    StreetName = userToAdd.StreetName,
                    StreetNo = userToAdd.StreetNo,
                    CNP = userToAdd.CNP,
                    CountryId = userToAdd.CountryId,
                    CountyId = userToAdd.CountyId,
                    CityId = userToAdd.CityId,
                    GenderId = userToAdd.GenderId,
                    EmailAddress = userToAdd.Email,
                    PhoneNumber = userToAdd.PhoneNumber,
                    UserId = user.Id
                };

                await _context.AddAsync(userProfile);

                await _context.SaveChangesAsync();

                // Commit transaction if all commands succeed, transaction will auto-rollback
                // when disposed if either commands fails
                await transaction.CommitAsync();
                return await GenerateAuthenticationResultForUserAsync(user);
            }
            catch (Exception e)
            {
                await transaction.RollbackAsync();

                throw new Exception(e.ToString());
            }
        }

        public async Task<AuthenticationResult> LoginAsync(LoginUserCommand loginUser)
        {
            var user = await _userManager.FindByEmailAsync(loginUser.Email);

            if (user == null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User does not exist" }
                };
            }

            var userHasValidPassword = await _userManager.CheckPasswordAsync(user, loginUser.Password);

            if (!userHasValidPassword)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User/password combination is wrong" }
                };
            }

            return await GenerateAuthenticationResultForUserAsync(user);
        }

        private async Task<AuthenticationResult> GenerateAuthenticationResultForUserAsync(ApplicationUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

            var userProfile = await GetUserProfileByUserId(user.Id);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("firstName", userProfile.FirstName),
                new Claim("lastName", userProfile.LastName),
                new Claim("id", userProfile.Id.ToString())
            };

            var userClaims = await _userManager.GetClaimsAsync(user);
            claims.AddRange(userClaims);

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var userRole in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole));
                var role = await _roleManager.FindByNameAsync(userRole);
                if (role == null) continue;
                var roleClaims = await _roleManager.GetClaimsAsync(role);

                foreach (var roleClaim in roleClaims)
                {
                    if (claims.Contains(roleClaim))
                        continue;

                    claims.Add(roleClaim);
                }
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(_jwtSettings.TokenLifetime),
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            await _context.SaveChangesAsync();

            return new AuthenticationResult
            {
                Success = true,
                Token = tokenHandler.WriteToken(token)
            };
        }

        private async Task<UserProfile> GetUserProfileByUserId(long userId)
        {
            return await _context.UserProfiles.SingleOrDefaultAsync(x => x.UserId == userId && !x.Deleted);
        }
    }
}
