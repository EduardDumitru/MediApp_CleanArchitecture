using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetMedicalCheckTypeDetailsQuery : IRequest<MedicalCheckTypeDetailsVm>
    {
        public short Id { get; set; }
    }

    public class
        GetMedicalCheckTypeDetailsQueryHandler : IRequestHandler<GetMedicalCheckTypeDetailsQuery,
            MedicalCheckTypeDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetMedicalCheckTypeDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MedicalCheckTypeDetailsVm> Handle(GetMedicalCheckTypeDetailsQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.MedicalCheckTypes.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<MedicalCheckTypeDetailsVm>(entity);
        }
    }
}