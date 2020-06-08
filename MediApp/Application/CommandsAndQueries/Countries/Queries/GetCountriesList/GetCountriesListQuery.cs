using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetCountriesListQuery : IRequest<CountriesListVm>
    {
    }

    public class GetCountriesListQueryHandler : IRequestHandler<GetCountriesListQuery, CountriesListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCountriesListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CountriesListVm> Handle(GetCountriesListQuery request, CancellationToken cancellationToken)
        {
            var countries = await _context.Countries
                .ProjectTo<CountriesLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new CountriesListVm
            {
                Countries = countries
            };

            return vm;
        }
    }
}