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
    public class GetPatientPrescriptionsListQuery : IRequest<PatientPrescriptionsListVm>
    {
        public long PatientId { get; set; }
    }

    public class GetPatientPrescriptionsListQueryHandler 
        : IRequestHandler<GetPatientPrescriptionsListQuery, PatientPrescriptionsListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPatientPrescriptionsListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PatientPrescriptionsListVm> Handle(GetPatientPrescriptionsListQuery request,
            CancellationToken cancellationToken)
        {
            var patientPrescriptions = await _context.Prescriptions
                .Where(x => x.PatientId == request.PatientId)
                .Include(x => x.Employee).Include(x => x.UserProfile)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.Clinic)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.MedicalCheckType)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.Diagnosis)
                .ProjectTo<PatientPrescriptionsLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new PatientPrescriptionsListVm()
            {
                PatientPrescriptions = patientPrescriptions
            };

            return vm;
        }
    }
}