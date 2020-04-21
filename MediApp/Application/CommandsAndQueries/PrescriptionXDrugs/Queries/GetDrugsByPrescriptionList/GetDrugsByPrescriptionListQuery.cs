using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetDrugsByPrescriptionListQuery : IRequest<PrescriptionXDrugsListVm>
    {
    }

    public class GetDrugsByPrescriptionListQueryHandler : IRequestHandler<GetDrugsByPrescriptionListQuery,
        PrescriptionXDrugsListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDrugsByPrescriptionListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PrescriptionXDrugsListVm> Handle(GetDrugsByPrescriptionListQuery request,
            CancellationToken cancellationToken)
        {
            var prescriptionXDrugs = await _context.PrescriptionXDrugs
                .Include(x => x.Drug)
                .ProjectTo<PrescriptionXDrugsLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new PrescriptionXDrugsListVm()
            {
                PrescriptionXDrugs = prescriptionXDrugs
            };

            return vm;
        }
    }
}