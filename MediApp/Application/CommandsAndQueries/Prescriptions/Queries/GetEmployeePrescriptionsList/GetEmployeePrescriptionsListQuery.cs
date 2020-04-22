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
    public class GetEmployeePrescriptionsListQuery : IRequest<EmployeePrescriptionsListVm>
    {
        public long EmployeeId { get; set; }
    }

    public class GetEmployeePrescriptionsListQueryHandler
        : IRequestHandler<GetEmployeePrescriptionsListQuery, EmployeePrescriptionsListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetEmployeePrescriptionsListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EmployeePrescriptionsListVm> Handle(GetEmployeePrescriptionsListQuery request,
            CancellationToken cancellationToken)
        {
            var employeePrescriptions = await _context.Prescriptions
                .Where(x => x.EmployeeId == request.EmployeeId)
                .Include(x => x.UserProfile)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.Clinic)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.MedicalCheckType)
                .Include(x => x.MedicalCheck).ThenInclude(x => x.Diagnosis)
                .ProjectTo<EmployeePrescriptionsLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new EmployeePrescriptionsListVm()
            {
                EmployeePrescriptions = employeePrescriptions
            };

            return vm;
        }
    }
}