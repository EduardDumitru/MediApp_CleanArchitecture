using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetHolidayIntervalsByClinicListQuery : IRequest<HolidayIntervalsListVm>
    {
        public int ClinicId { get; set; }
    }

    public class
        GetHolidayIntervalsByClinicListQueryHandler : IRequestHandler<GetHolidayIntervalsByClinicListQuery,
            HolidayIntervalsListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetHolidayIntervalsByClinicListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<HolidayIntervalsListVm> Handle(GetHolidayIntervalsByClinicListQuery request,
            CancellationToken cancellationToken)
        {
            var holidayIntervalsByClinic = await _context.HolidayIntervals
                .Where(x => x.Employee.ClinicId == request.ClinicId)
                .Include(x => x.Employee).ThenInclude(x => x.UserProfile)
                .Include(x => x.Employee).ThenInclude(x => x.Clinic)
                .OrderByDescending(x => x.StartDate).ThenByDescending(x => x.EndDate)
                .ProjectTo<HolidayIntervalsLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new HolidayIntervalsListVm
            {
                HolidayIntervals = holidayIntervalsByClinic
            };

            return vm;
        }
    }
}
