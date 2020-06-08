using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetHolidayIntervalsListQuery : IRequest<HolidayIntervalsListVm>
    {
    }

    public class
        GetHolidayIntervalsListQueryHandler : IRequestHandler<GetHolidayIntervalsListQuery, HolidayIntervalsListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetHolidayIntervalsListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<HolidayIntervalsListVm> Handle(GetHolidayIntervalsListQuery request,
            CancellationToken cancellationToken)
        {
            var holidayIntervals = await _context.HolidayIntervals
                .Include(x => x.Employee).ThenInclude(x => x.UserProfile)
                .OrderByDescending(x => x.StartDate).ThenByDescending(x => x.EndDate)
                .ProjectTo<HolidayIntervalsLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new HolidayIntervalsListVm
            {
                HolidayIntervals = holidayIntervals
            };

            return vm;
        }
    }
}