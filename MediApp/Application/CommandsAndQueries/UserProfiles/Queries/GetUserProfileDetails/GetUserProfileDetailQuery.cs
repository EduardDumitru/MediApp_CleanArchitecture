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
        private readonly ICurrentUserService _currentUserService;

        public GetUserProfileDetailQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<UserProfileDetailVm> Handle(GetUserProfileDetailQuery request, CancellationToken cancellationToken)
        {
            //Sa nu uiti sa faci verificarea daca e sau nu persoana respectiva conectat
            var entity = await _context.UserProfiles
                .FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<UserProfileDetailVm>(entity);
        }
    }
}
