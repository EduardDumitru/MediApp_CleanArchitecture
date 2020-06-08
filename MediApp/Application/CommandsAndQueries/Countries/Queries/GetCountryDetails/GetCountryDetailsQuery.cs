using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetCountryDetailsQuery : IRequest<CountryDetailsVm>
    {
        public short Id { get; set; }
    }

    public class GetCountryDetailsQueryHandler : IRequestHandler<GetCountryDetailsQuery, CountryDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCountryDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CountryDetailsVm> Handle(GetCountryDetailsQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.Countries.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<CountryDetailsVm>(entity);
        }
    }
}