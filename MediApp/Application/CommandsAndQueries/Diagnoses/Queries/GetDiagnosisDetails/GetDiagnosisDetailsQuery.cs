using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetDiagnosisDetailsQuery : IRequest<DiagnosisDetailsVm>
    {
        public int Id { get; set; }
    }

    public class GetDiagnosisDetailsQueryHandler : IRequestHandler<GetDiagnosisDetailsQuery, DiagnosisDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDiagnosisDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DiagnosisDetailsVm> Handle(GetDiagnosisDetailsQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Diagnoses.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<DiagnosisDetailsVm>(entity);
        }
    }
}