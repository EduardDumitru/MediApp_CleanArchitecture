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
    public class GetClinicListQuery : IRequest<ClinicsListVm>
    {
    }

    public class GetClinicListQueryHandler : IRequestHandler<GetClinicListQuery, ClinicsListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetClinicListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ClinicsListVm> Handle(GetClinicListQuery request, CancellationToken cancellationToken)
        {
            var clinics = await _context.Clinics
                .Include(x => x.Country)
                .Include(x => x.County)
                .Include(x => x.City)
                .ProjectTo<ClinicsLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new ClinicsListVm()
            {
                Clinics = clinics
            };

            return vm;
        }
    }
}
