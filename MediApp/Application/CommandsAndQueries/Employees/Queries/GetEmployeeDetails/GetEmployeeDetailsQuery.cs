using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetEmployeeDetailsQuery : IRequest<EmployeeDetailsVm>
    {
        public long Id { get; set; }
    }

    public class
        GetEmployeeDetailsQueryHandler : IRequestHandler<GetEmployeeDetailsQuery, EmployeeDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetEmployeeDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EmployeeDetailsVm> Handle(GetEmployeeDetailsQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Employees.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<EmployeeDetailsVm>(entity);
        }
    }
}