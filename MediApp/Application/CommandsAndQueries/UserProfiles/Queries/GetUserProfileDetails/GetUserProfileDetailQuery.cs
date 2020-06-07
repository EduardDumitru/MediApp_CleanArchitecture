using System;
using System.Collections.Generic;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetUserProfileDetailQuery : IRequest<UserProfileDetailVm>
    {
        public long Id { get; set; }
    }

    public class GetUserProfileDetailQueryHandler : IRequestHandler<GetUserProfileDetailQuery, UserProfileDetailVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IIdentityService _identityService;

        public GetUserProfileDetailQueryHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
        {
            _context = context;
            _mapper = mapper;
            _identityService = identityService;
        }

        public async Task<UserProfileDetailVm> Handle(GetUserProfileDetailQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.UserProfiles
                .FindAsync(request.Id);

            var entityVm = entity == null ? null : _mapper.Map<UserProfileDetailVm>(entity);

            if (entityVm != null)
            {
                entityVm.RoleIds = await _identityService.GetUserRoleIds(entity.UserId, cancellationToken);
            }

            return entityVm;
        }
    }
}
