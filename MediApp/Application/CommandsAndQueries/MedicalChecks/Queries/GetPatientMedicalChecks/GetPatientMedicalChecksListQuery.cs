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
    public class GetPatientMedicalChecksListQuery : IRequest<PatientMedicalChecksListVm>
    {
        public long PatientId { get; set; }
    }

    public class GetPatientMedicalChecksListQueryHandler
        : IRequestHandler<GetPatientMedicalChecksListQuery, PatientMedicalChecksListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPatientMedicalChecksListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PatientMedicalChecksListVm> Handle(GetPatientMedicalChecksListQuery request,
            CancellationToken cancellationToken)
        {
            var patientMedicalChecks = await _context.MedicalChecks
                .Where(x => x.PatientId == request.PatientId)
                .Include(x => x.Employee).ThenInclude(x => x.UserProfile)
                .Include(x => x.Clinic)
                .Include(x => x.MedicalCheckType)
                .Include(x => x.Diagnosis)
                .OrderByDescending(x => x.CreatedOn)
                .ProjectTo<PatientMedicalChecksLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new PatientMedicalChecksListVm
            {
                PatientMedicalChecks = patientMedicalChecks
            };

            return vm;
        }
    }
}