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
    public class GetClinicDetailsQuery : IRequest<ClinicDetailsVm>
    {
        public int Id { get; set; }
    }

    public class GetClinicDetailsQueryHandler : IRequestHandler<GetClinicDetailsQuery, ClinicDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetClinicDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ClinicDetailsVm> Handle(GetClinicDetailsQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.Clinics.FindAsync(request.Id);

            return entity == null ? null : _mapper.Map<ClinicDetailsVm>(entity);
        }
    }
}
