using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetHolidayIntervalDetailsQuery : IRequest<HolidayIntervalDetailsVm>
    {
        public long Id { get; set; }
    }

    public class GetHolidayIntervalDetailsQueryHandler : IRequestHandler<GetHolidayIntervalDetailsQuery, HolidayIntervalDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetHolidayIntervalDetailsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<HolidayIntervalDetailsVm> Handle(GetHolidayIntervalDetailsQuery request, CancellationToken cancellationToken)
        {
            var entity = await _context.HolidayIntervals
                .Include(x => x.Employee)
                .ThenInclude(x => x.UserProfile).FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            return entity == null ? null : _mapper.Map<HolidayIntervalDetailsVm>(entity);
        }
    }
}