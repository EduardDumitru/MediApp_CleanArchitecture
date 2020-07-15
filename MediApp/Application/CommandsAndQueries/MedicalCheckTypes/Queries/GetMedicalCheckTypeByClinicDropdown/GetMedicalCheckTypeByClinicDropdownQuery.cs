using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetMedicalCheckTypeByClinicDropdownQuery : IRequest<SelectItemVm>
    {
        public int ClinicId { get; set; }
        public DateTime Appointment { get; set; }
    }

    public class GetMedicalCheckTypeByClinicDropdownQueryHandler : IRequestHandler<GetMedicalCheckTypeByClinicDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetMedicalCheckTypeByClinicDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetMedicalCheckTypeByClinicDropdownQuery request,
            CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Employees
                    .Include(x => x.MedicalCheckType)
                    .Include(x => x.HolidayIntervals)
                    .Where(x => request.ClinicId == x.ClinicId && !x.Deleted && x.MedicalCheckTypeId.HasValue && !x.MedicalCheckType.Deleted)
                    .Where(x => !x.HolidayIntervals.Any(y => y.StartDate.Date <= request.Appointment.ToLocalTime().Date 
                                                             && y.EndDate.Date >= request.Appointment.ToLocalTime().Date) 
                                && (!x.TerminationDate.HasValue || x.TerminationDate.Value.Date > request.Appointment.ToLocalTime().Date))
                    .Select(x => new SelectItemDto {Label = x.MedicalCheckType.Name, Value = x.MedicalCheckTypeId.ToString()})
                    .Distinct()
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
