using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetEmployeesListQuery : IRequest<EmployeesListVm>
    {
    }

    public class
        GetEmployeesListQueryHandler : IRequestHandler<GetEmployeesListQuery, EmployeesListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetEmployeesListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EmployeesListVm> Handle(GetEmployeesListQuery request,
            CancellationToken cancellationToken)
        {
            var employees = await _context.Employees
                .Include(x => x.UserProfile)
                .Include(x => x.MedicalCheckType)
                .Include(x => x.EmployeeType)
                .Include(x => x.Clinic)
                .ProjectTo<EmployeesLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new EmployeesListVm()
            {
                Employees = employees
            };

            return vm;
        }
    }
}