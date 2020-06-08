using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class UpdateUserProfileCommand : IRequest<Result>
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNo { get; set; }
        public string CNP { get; set; }
        public string PhoneNumber { get; set; }
        public short CountryId { get; set; }
        public int CountyId { get; set; }
        public int CityId { get; set; }
        public short GenderId { get; set; }
        public List<long> RoleIds { get; set; }
    }

    public class UpdateUserProfileCommandHandler : IRequestHandler<UpdateUserProfileCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        private readonly IIdentityService _identityService;

        public UpdateUserProfileCommandHandler(IApplicationDbContext context, IIdentityService identityService)
        {
            _context = context;
            _identityService = identityService;
        }

        public async Task<Result> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.UserProfiles.FindAsync(request.Id);

            if (entity == null) return Result.Failure(new List<string> {"No valid profile found"});

            entity.FirstName = request.FirstName;
            entity.LastName = request.LastName;
            entity.MiddleName = request.MiddleName;
            entity.CNP = request.CNP;
            entity.StreetNo = request.StreetNo;
            entity.StreetName = request.StreetName;
            entity.Address = request.Address;
            entity.PhoneNumber = request.PhoneNumber;
            entity.CountryId = request.CountryId;
            entity.CountyId = request.CountyId;
            entity.CityId = request.CityId;
            entity.GenderId = request.GenderId;
            await _identityService.AddUserToRoles(entity.UserId, request.RoleIds, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Profile update was successful");
        }
    }
}