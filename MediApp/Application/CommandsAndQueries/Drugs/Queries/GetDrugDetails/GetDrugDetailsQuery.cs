using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetDrugDetailsQuery : IRequest<DrugDetailsVm>
    {
        public int Id { get; set; }
    }

    public class GetDrugDetailsQueryHandler : IRequestHandler<GetDrugDetailsQuery, DrugDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDrugDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DrugDetailsVm> Handle(GetDrugDetailsQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Drugs.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<DrugDetailsVm>(entity);
        }
    }
}
