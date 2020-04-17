using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetMedicalCheckTypesListQuery : IRequest<MedicalCheckTypesListVm>
    {
    }

    public class GetMedicalCheckTypesListQueryHandler : IRequestHandler<GetMedicalCheckTypesListQuery, MedicalCheckTypesListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetMedicalCheckTypesListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MedicalCheckTypesListVm> Handle(GetMedicalCheckTypesListQuery request, CancellationToken cancellationToken)
        {
            var medicalCheckTypes = await _context.MedicalCheckTypes
                .ProjectTo<MedicalCheckTypesLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new MedicalCheckTypesListVm()
            {
                MedicalCheckTypes = medicalCheckTypes
            };

            return vm;
        }
    }
}