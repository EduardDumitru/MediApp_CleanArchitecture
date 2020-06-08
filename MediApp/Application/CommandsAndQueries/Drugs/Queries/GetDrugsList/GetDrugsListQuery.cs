using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetDrugsListQuery : IRequest<DrugsListVm>
    {
    }

    public class GetDrugsListQueryHandler : IRequestHandler<GetDrugsListQuery, DrugsListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDrugsListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DrugsListVm> Handle(GetDrugsListQuery request, CancellationToken cancellationToken)
        {
            var drugs = await _context.Drugs
                .ProjectTo<DrugsLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new DrugsListVm
            {
                Drugs = drugs
            };

            return vm;
        }
    }
}