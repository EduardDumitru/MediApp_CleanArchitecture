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
    public class GetCitiesQuery : IRequest<CitiesListVm>
    {
    }

    public class GetCitiesQueryHandler : IRequestHandler<GetCitiesQuery, CitiesListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCitiesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CitiesListVm> Handle(GetCitiesQuery request, CancellationToken cancellationToken)
        {
            var cities = await _context.Cities
                .Include(x => x.County)
                .ThenInclude(x => x.Country)
                .ProjectTo<CitiesLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new CitiesListVm()
            {
                Cities = cities
            };

            return vm;
        }
    }
}
