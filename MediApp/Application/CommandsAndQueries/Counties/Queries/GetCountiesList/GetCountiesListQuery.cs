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
    public class GetCountiesListQuery : IRequest<CountiesListVm>
    {
    }

    public class GetCountiesListQueryHandler : IRequestHandler<GetCountiesListQuery, CountiesListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCountiesListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CountiesListVm> Handle(GetCountiesListQuery request, CancellationToken cancellationToken)
        {
            var counties = await _context.Counties
                .Include(x => x.Country)
                .ProjectTo<CountiesLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new CountiesListVm()
            {
                Counties = counties
            };

            return vm;
        }
    }
}
