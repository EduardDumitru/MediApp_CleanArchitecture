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
    public class GetCountyDetailsQuery : IRequest<CountyDetailsVm>
    { 
        public int Id { get; set; }
    }

    public class GetCountyDetailsQueryHandler : IRequestHandler<GetCountyDetailsQuery, CountyDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCountyDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CountyDetailsVm> Handle(GetCountyDetailsQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.Counties.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<CountyDetailsVm>(entity);
        }
    }
}
