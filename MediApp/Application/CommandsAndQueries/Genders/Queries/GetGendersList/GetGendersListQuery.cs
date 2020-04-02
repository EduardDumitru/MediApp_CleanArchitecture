using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetGendersListQuery : IRequest<GendersListVm>
    { }

    public class GetGendersListQueryHandler : IRequestHandler<GetGendersListQuery, GendersListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GetGendersListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<GendersListVm> Handle(GetGendersListQuery request, CancellationToken cancellationToken)
        {
            var genders = await _context.UserProfiles
                .ProjectTo<GendersLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new GendersListVm()
            {
                Genders = genders
            };

            return vm;
        }
    }
}
