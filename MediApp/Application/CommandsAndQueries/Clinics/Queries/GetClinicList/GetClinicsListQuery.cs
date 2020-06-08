using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetClinicsListQuery : IRequest<ClinicsListVm>
    {
    }

    public class GetClinicsListQueryHandler : IRequestHandler<GetClinicsListQuery, ClinicsListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetClinicsListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ClinicsListVm> Handle(GetClinicsListQuery request, CancellationToken cancellationToken)
        {
            var clinics = await _context.Clinics
                .Include(x => x.Country)
                .Include(x => x.County)
                .Include(x => x.City)
                .ProjectTo<ClinicsLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new ClinicsListVm
            {
                Clinics = clinics
            };

            return vm;
        }
    }
}