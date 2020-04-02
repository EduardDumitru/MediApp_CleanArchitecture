using System;
using System.Collections.Generic;
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

        public GetUserProfileDetailQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserProfileDetailVm> Handle(GetUserProfileDetailQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.UserProfiles
                .FindAsync(request.Id);

            return _mapper.Map<UserProfileDetailVm>(entity);
        }
    }
}
