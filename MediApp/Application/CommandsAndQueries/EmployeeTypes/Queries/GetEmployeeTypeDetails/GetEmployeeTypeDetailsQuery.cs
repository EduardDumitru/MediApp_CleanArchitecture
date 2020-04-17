using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetEmployeeTypeDetailsQuery : IRequest<EmployeeTypeDetailsVm>
    {
        public short Id { get; set; }
    }

    public class GetEmployeeTypeDetailsQueryHandler : IRequestHandler<GetEmployeeTypeDetailsQuery, EmployeeTypeDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetEmployeeTypeDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EmployeeTypeDetailsVm> Handle(GetEmployeeTypeDetailsQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.EmployeeTypes.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<EmployeeTypeDetailsVm>(entity);
        }
    }
}