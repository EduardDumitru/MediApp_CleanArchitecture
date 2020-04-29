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
    public class GetEmployeeMedicalChecksListQuery : IRequest<EmployeeMedicalChecksListVm>
    {
        public long EmployeeId { get; set; }
    }

    public class GetEmployeeMedicalChecksListQueryHandler
        : IRequestHandler<GetEmployeeMedicalChecksListQuery, EmployeeMedicalChecksListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetEmployeeMedicalChecksListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EmployeeMedicalChecksListVm> Handle(GetEmployeeMedicalChecksListQuery request,
            CancellationToken cancellationToken)
        {
            var employeeMedicalChecks = await _context.MedicalChecks
                .Where(x => x.EmployeeId == request.EmployeeId)
                .Include(x => x.UserProfile)
                .Include(x => x.Clinic)
                .Include(x => x.MedicalCheckType)
                .Include(x => x.Diagnosis)
                .ProjectTo<EmployeeMedicalChecksLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new EmployeeMedicalChecksListVm()
            {
                EmployeeMedicalChecks = employeeMedicalChecks
            };

            return vm;
        }
    }
}