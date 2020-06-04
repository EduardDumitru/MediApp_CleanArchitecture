using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetPrescriptionDetailsQuery : IRequest<PrescriptionDetailsVm>
    {
        public long Id { get; set; }
    }

    public class GetPrescriptionDetailsQueryHandler 
        : IRequestHandler<GetPrescriptionDetailsQuery, PrescriptionDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPrescriptionDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PrescriptionDetailsVm> Handle(GetPrescriptionDetailsQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Prescriptions
                .Include(x => x.Employee).ThenInclude(x => x.UserProfile)
                .Include(x => x.UserProfile)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.MedicalCheckType)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.Clinic)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.Diagnosis)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            return entity == null ? null : _mapper.Map<PrescriptionDetailsVm>(entity);
        }
    }
}