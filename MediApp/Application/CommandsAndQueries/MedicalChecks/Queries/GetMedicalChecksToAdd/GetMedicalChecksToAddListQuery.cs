using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Constants;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetMedicalChecksToAddListQuery : IRequest<MedicalChecksToAddListVm>
    {
        public DateTime Appointment { get; set; }
        public int ClinicId { get; set; }
        public long EmployeeId { get; set; }
        public short MedicalCheckTypeId { get; set; }
    }

    public class GetMedicalChecksToAddListQueryHandler
        : IRequestHandler<GetMedicalChecksToAddListQuery, MedicalChecksToAddListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetMedicalChecksToAddListQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MedicalChecksToAddListVm> Handle(GetMedicalChecksToAddListQuery request,
            CancellationToken cancellationToken)
        {
            var wantedAppointmentDate = request.Appointment.ToLocalTime();
            var existingMedicalChecks = await _context.MedicalChecks
                .Where(x => wantedAppointmentDate <= x.Appointment
                            && x.ClinicId == request.ClinicId
                            && x.EmployeeId == request.EmployeeId
                            && x.MedicalCheckTypeId == request.MedicalCheckTypeId
                            && !x.Deleted)
                .ToListAsync(cancellationToken);

            var nrOfMedicalChecksAdded = 0;
            var employee = await _context.Employees
                .Where(x => x.Id == request.EmployeeId)
                .Include(x => x.UserProfile)
                .FirstOrDefaultAsync(cancellationToken);
            var clinic = await _context.Clinics
                .Where(x => x.Id == request.ClinicId)
                .FirstOrDefaultAsync(cancellationToken);
            var medicalCheckType = await _context.MedicalCheckTypes
                .Where(x => x.Id == request.MedicalCheckTypeId)
                .FirstOrDefaultAsync(cancellationToken);

            var startHour = employee.StartHour;

            if (wantedAppointmentDate.Date == DateTime.Now.Date)
            {
                if (employee.StartHour > wantedAppointmentDate.TimeOfDay)
                {
                    startHour = employee.StartHour;
                }
                else if (employee.StartHour <= wantedAppointmentDate.TimeOfDay &&
                         employee.EndHour >= wantedAppointmentDate.TimeOfDay)
                {
                    if (wantedAppointmentDate.Minute > 0 && wantedAppointmentDate.Minute < 30)
                    {
                        wantedAppointmentDate = new DateTime(wantedAppointmentDate.Year,
                            wantedAppointmentDate.Month, wantedAppointmentDate.Day,
                            wantedAppointmentDate.Hour, 30, wantedAppointmentDate.Second
                        );
                        startHour = wantedAppointmentDate.TimeOfDay;
                    }

                    if (wantedAppointmentDate.Minute > 30)
                    {
                        wantedAppointmentDate = new DateTime(wantedAppointmentDate.Year,
                            wantedAppointmentDate.Month, wantedAppointmentDate.Day,
                            wantedAppointmentDate.Hour + 1, 0, wantedAppointmentDate.Second
                        );
                        startHour = wantedAppointmentDate.TimeOfDay;
                    }
                } 
                else if (employee.EndHour <= wantedAppointmentDate.TimeOfDay)
                {
                    wantedAppointmentDate = wantedAppointmentDate.AddDays(1);
                    startHour = employee.StartHour;
                }
            }

            wantedAppointmentDate = wantedAppointmentDate.DayOfWeek switch
            {
                DayOfWeek.Saturday => wantedAppointmentDate.AddDays(2),
                DayOfWeek.Sunday => wantedAppointmentDate.AddDays(1),
                _ => wantedAppointmentDate
            };

            var medicalChecksToAdd = new List<MedicalChecksToAddLookupDto>();
            var thirtyMinutes = new TimeSpan(0, 0, 30, 0);
            var exceedsTerminationDate = false;
            while (nrOfMedicalChecksAdded < MedicalCheckConstants.NrOfMedicalChecksToBeShown && !exceedsTerminationDate)
            {
                for (var time = startHour;
                    time <= employee.EndHour && nrOfMedicalChecksAdded <=
                    MedicalCheckConstants.NrOfMedicalChecksToBeShown;
                    time = time.Add(thirtyMinutes))
                {
                    var appointment = new DateTime(wantedAppointmentDate.Year,
                        wantedAppointmentDate.Month,
                        wantedAppointmentDate.Day,
                        time.Hours,
                        time.Minutes,
                        time.Seconds);

                    if (employee.TerminationDate.HasValue && appointment.Date >= employee.TerminationDate.Value.Date)
                    {
                        exceedsTerminationDate = true;
                        break;
                    }

                    if (existingMedicalChecks.Any(x => x.Appointment == appointment)) continue;

                    medicalChecksToAdd.Add(new MedicalChecksToAddLookupDto
                    {
                        Appointment = appointment,
                        ClinicId = clinic.Id,
                        ClinicName = clinic.Name,
                        EmployeeId = employee.Id,
                        EmployeeName = employee.UserProfile.GetFullName(),
                        MedicalCheckTypeId = medicalCheckType.Id,
                        MedicalCheckTypeName = medicalCheckType.Name
                    });

                    nrOfMedicalChecksAdded++;
                }

                wantedAppointmentDate = wantedAppointmentDate.AddDays(1);
                wantedAppointmentDate = wantedAppointmentDate.DayOfWeek switch
                {
                    DayOfWeek.Saturday => wantedAppointmentDate.AddDays(2),
                    DayOfWeek.Sunday => wantedAppointmentDate.AddDays(1),
                    _ => wantedAppointmentDate
                };
                startHour = employee.StartHour;
            }

            var vm = new MedicalChecksToAddListVm
            {
                MedicalChecksToAdd = medicalChecksToAdd
            };

            return vm;
        }
    }
}