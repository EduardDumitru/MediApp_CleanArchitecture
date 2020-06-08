using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetGenderDetailsQuery : IRequest<GenderDetailsVm>
    {
        public short Id { get; set; }
    }

    public class GetGenderDetailsQueryHandler : IRequestHandler<GetGenderDetailsQuery, GenderDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetGenderDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<GenderDetailsVm> Handle(GetGenderDetailsQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.Genders.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<GenderDetailsVm>(entity);
        }
    }
}