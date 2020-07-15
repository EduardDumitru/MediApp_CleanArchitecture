using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddMedicalCheckCommandValidator : AbstractValidator<AddMedicalCheckCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IDateTime _dateTime;

        public AddMedicalCheckCommandValidator(IApplicationDbContext context, IDateTime dateTime)
        {
            _context = context;
            _dateTime = dateTime;
            RuleFor(x => x.ClinicId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Clinic is required")
                .MustAsync(ExistsClinic).WithMessage("Clinic is not valid");
            RuleFor(x => x.MedicalCheckTypeId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Medical Check Type is required")
                .MustAsync(ExistsMedicalCheckType).WithMessage("Medical Check Type is not valid");
            RuleFor(x => x.PatientId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Patient is required")
                .MustAsync(ExistsPatient).WithMessage("Patient is not valid");
            RuleFor(x => x.EmployeeId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Employee is required")
                .MustAsync(ExistsEmployee).WithMessage("Employee is not valid")
                .MustAsync(ExistsEmployeeInClinic).WithMessage("Employee is not available in this clinic")
                .MustAsync(ExistsEmployeeInMedicalCheckType)
                .WithMessage("Employee is not available in this medical check type");
            RuleFor(x => x.Appointment)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Appointment is required")
                .MustAsync(BeHigherThanCurrentDate).WithMessage("Appointment is not valid")
                .MustAsync(BeFromHalfToHalfHours).WithMessage("Appointment must be from half to half hours.")
                .MustAsync(NotInterfereWithOtherAppointments).WithMessage("Appointment time is taken. " +
                                                                          "Please choose another time for the appointment.")
                .MustAsync(NotInterfereWithHolidayInterval).WithMessage("Doctor is on a holiday. " +
                                                                        "Please choose another time for the appointment.");
        }

        private async Task<bool> ExistsEmployee(long employeeId, CancellationToken cancellationToken)
        {
            return await _context.Employees
                .AnyAsync(x => x.Id == employeeId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsEmployeeInClinic(AddMedicalCheckCommand medicalCheckCommand, long employeeId,
            CancellationToken cancellationToken)
        {
            return await _context.Employees
                .AnyAsync(x => x.Id == employeeId && x.ClinicId == medicalCheckCommand.ClinicId && !x.Deleted,
                    cancellationToken);
        }

        private async Task<bool> ExistsEmployeeInMedicalCheckType(AddMedicalCheckCommand medicalCheckCommand, long employeeId,
            CancellationToken cancellationToken)
        {
            return await _context.Employees
                .AnyAsync(x => x.Id == employeeId && x.MedicalCheckTypeId == medicalCheckCommand.MedicalCheckTypeId &&
                               !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsClinic(int clinicId, CancellationToken cancellationToken)
        {
            return await _context.Clinics
                .AnyAsync(x => x.Id == clinicId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsMedicalCheckType(short medicalCheckTypeId, CancellationToken cancellationToken)
        {
            return await _context.MedicalCheckTypes
                .AnyAsync(x => x.Id == medicalCheckTypeId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsPatient(long patientId, CancellationToken cancellationToken)
        {
            return await _context.UserProfiles
                .AnyAsync(x => x.Id == patientId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> BeHigherThanCurrentDate(DateTime appointmentDate, CancellationToken cancellationToken)
        {
            return await Task.FromResult(appointmentDate.ToLocalTime() >= _dateTime.Now);
        }

        private async Task<bool> BeFromHalfToHalfHours(DateTime appointmentDate, CancellationToken cancellationToken)
        {
            var date = appointmentDate.ToLocalTime();
            return await Task.FromResult(date.TimeOfDay.Minutes == 30 ||
                                         date.TimeOfDay.Minutes == 0);
        }

        private async Task<bool> NotInterfereWithOtherAppointments(DateTime appointmentDate,
            CancellationToken cancellationToken)
        {
            return !await _context.MedicalChecks.AnyAsync(x => x.Appointment == appointmentDate.ToLocalTime()
                                                               && !x.Deleted,
                cancellationToken);
        }

        private async Task<bool> NotInterfereWithHolidayInterval(AddMedicalCheckCommand medicalCheckCommand, DateTime appointmentDate,
            CancellationToken cancellationToken)
        {
            return !await _context.HolidayIntervals.AnyAsync(x => x.StartDate.Date <= appointmentDate.ToLocalTime().Date
                                                                  && x.EndDate.Date >= appointmentDate.ToLocalTime().Date
                                                                  && x.EmployeeId == medicalCheckCommand.EmployeeId
                                                                  && !x.Deleted,
                cancellationToken);
        }
    }
}