using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetPrescriptionsByMedicalCheckListQuery : IRequest<PrescriptionsByMedicalCheckListVm>
    {
        public long MedicalCheckId { get; set; }
    }

    public class GetPrescriptionsByMedicalCheckListQueryHandler
        : IRequestHandler<GetPrescriptionsByMedicalCheckListQuery, PrescriptionsByMedicalCheckListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPrescriptionsByMedicalCheckListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PrescriptionsByMedicalCheckListVm> Handle(GetPrescriptionsByMedicalCheckListQuery request,
            CancellationToken cancellationToken)
        {
            var prescriptionsByMedicalCheck = await _context.Prescriptions
                .Where(x => x.MedicalCheckId == request.MedicalCheckId)
                .Include(x => x.Employee).Include(x => x.UserProfile)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.Clinic)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.MedicalCheckType)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.Diagnosis)
                .Include(x => x.UserProfile)
                .OrderByDescending(x => x.CreatedOn)
                .ProjectTo<PrescriptionsByMedicalCheckLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new PrescriptionsByMedicalCheckListVm
            {
                PrescriptionsByMedicalCheck = prescriptionsByMedicalCheck
            };

            return vm;
        }
    }
}