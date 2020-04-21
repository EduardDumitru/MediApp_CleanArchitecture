using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetDiagnosisXDrugsListQuery : IRequest<DiagnosisXDrugsListVm>
    {
    }

    public class GetDiagnosisXDrugsListQueryHandler : IRequestHandler<GetDiagnosisXDrugsListQuery, DiagnosisXDrugsListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDiagnosisXDrugsListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DiagnosisXDrugsListVm> Handle(GetDiagnosisXDrugsListQuery request,
            CancellationToken cancellationToken)
        {
            var diagnosisXDrugs = await _context.DiagnosisXDrugs
                .Include(x => x.Diagnosis)
                .Include(x => x.Drug)
                .ProjectTo<DiagnosisXDrugsLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new DiagnosisXDrugsListVm()
            {
                DiagnosisXDrugs = diagnosisXDrugs
            };

            return vm;
        }
    }
}