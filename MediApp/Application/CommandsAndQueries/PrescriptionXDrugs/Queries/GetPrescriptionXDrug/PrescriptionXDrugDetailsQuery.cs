using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetPrescriptionXDrugDetailsQuery : IRequest<PrescriptionXDrugDetailsVm>
    {
        public long Id { get; set; }
    }

    public class GetPrescriptionXDrugDetailsQueryHandler : IRequestHandler<GetPrescriptionXDrugDetailsQuery,
        PrescriptionXDrugDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPrescriptionXDrugDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PrescriptionXDrugDetailsVm> Handle(GetPrescriptionXDrugDetailsQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.PrescriptionXDrugs
                .FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<PrescriptionXDrugDetailsVm>(entity);
        }
    }
}