using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetMedicalCheckDetailsQuery : IRequest<MedicalCheckDetailsVm>
    {
        public long Id { get; set; }
    }

    public class GetMedicalCheckDetailsQueryHandler
        : IRequestHandler<GetMedicalCheckDetailsQuery, MedicalCheckDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetMedicalCheckDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MedicalCheckDetailsVm> Handle(GetMedicalCheckDetailsQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.MedicalChecks
                .Include(x => x.Employee).ThenInclude(x => x.UserProfile)
                .Include(x => x.UserProfile)
                .Include(x => x.MedicalCheckType)
                .Include(x => x.Clinic)
                .Include(x => x.Diagnosis)
                .Include(x => x.Prescriptions)
                .ThenInclude(x => x.PrescriptionXDrugs)
                .ThenInclude(x => x.Drug)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            return entity == null ? null : _mapper.Map<MedicalCheckDetailsVm>(entity);
        }
    }
}