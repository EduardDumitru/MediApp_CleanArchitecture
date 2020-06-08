using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetUserProfilesListQuery : IRequest<UserProfileListVm>
    {
    }

    public class GetUserProfilesListQueryHandler : IRequestHandler<GetUserProfilesListQuery, UserProfileListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetUserProfilesListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserProfileListVm> Handle(GetUserProfilesListQuery request,
            CancellationToken cancellationToken)
        {
            var userProfiles = await _context.UserProfiles
                .ProjectTo<UserProfileLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new UserProfileListVm
            {
                UserProfiles = userProfiles
            };

            return vm;
        }
    }
}