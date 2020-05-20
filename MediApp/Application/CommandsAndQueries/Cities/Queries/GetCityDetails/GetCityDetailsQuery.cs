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
    public class GetCityDetailsQuery : IRequest<CityDetailsVm>
    {
        public int Id { get; set; }
    }

    public class GetCityDetailsQueryHandler : IRequestHandler<GetCityDetailsQuery, CityDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetCityDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CityDetailsVm> Handle(GetCityDetailsQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.Cities.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<CityDetailsVm>(entity);
        }
    }
}
