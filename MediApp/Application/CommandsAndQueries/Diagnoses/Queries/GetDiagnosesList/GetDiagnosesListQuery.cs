using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetDiagnosesListQuery : IRequest<DiagnosesListVm>
    {
    }

    public class GetDiagnosesListQueryHandler : IRequestHandler<GetDiagnosesListQuery, DiagnosesListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDiagnosesListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DiagnosesListVm> Handle(GetDiagnosesListQuery request, CancellationToken cancellationToken)
        {
            var diagnoses = await _context.Diagnoses
                .ProjectTo<DiagnosesLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new DiagnosesListVm
            {
                Diagnoses = diagnoses
            };

            return vm;
        }
    }
}