using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetEmployeeTypesListQuery : IRequest<EmployeeTypesListVm>
    {
    }

    public class GetEmployeeTypesListQueryHandler : IRequestHandler<GetEmployeeTypesListQuery, EmployeeTypesListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetEmployeeTypesListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EmployeeTypesListVm> Handle(GetEmployeeTypesListQuery request,
            CancellationToken cancellationToken)
        {
            var employeeTypes = await _context.EmployeeTypes
                .ProjectTo<EmployeeTypesLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new EmployeeTypesListVm
            {
                EmployeeTypes = employeeTypes
            };

            return vm;
        }
    }
}