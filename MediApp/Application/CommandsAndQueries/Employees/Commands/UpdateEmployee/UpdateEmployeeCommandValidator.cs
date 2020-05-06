using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Constants;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateEmployeeCommandValidator: AbstractValidator<UpdateEmployeeCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateEmployeeCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.ClinicId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Clinic is required")
                .MustAsync(ExistsClinic).WithMessage("Clinic is not valid");
            RuleFor(x => x.EmployeeTypeId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Employee Type is required")
                .MustAsync(ExistsEmployeeType).WithMessage("Employee Type is not valid")
                .Must(HaveNoMedicalCheckTypeIfNotDoctor).WithMessage("Only doctors can have medical check type")
                .Must(HaveMedicalCheckTypeIfDoctor).WithMessage("Medical Check Type is required for doctor");
            RuleFor(x => x.StartHour)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Start Hour is required")
                .MustAsync(BeHigherOrEqualThanSevenAM).WithMessage("Start Hour must be higher or equal than 07:00 AM")
                .MustAsync(BeFromHalfToHalfHours)
                .WithMessage("Start Hour must be from half to half hours. Example: 09:00 or 09:30");
            RuleFor(x => x.EndHour)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("End Hour is required")
                .MustAsync(BeLowerOrEqualThanEightPM).WithMessage("End Hour must be lower or equal than 20:00 PM")
                .MustAsync(BeFromHalfToHalfHours)
                .WithMessage("End Hour must be from half to half hours. Example: 09:00 or 09:30")
                .Must(BeHigherThanStartHourByAtLeastFourHours)
                .WithMessage("End Hour must be higher than Start Hour by at least four hours");
        }

        private async Task<bool> BeFromHalfToHalfHours(TimeSpan hours, CancellationToken cancellationToken)
        {
            return await Task.FromResult(hours.Minutes == 0 || hours.Minutes == 30);
        }

        private bool BeHigherThanStartHourByAtLeastFourHours(UpdateEmployeeCommand addEmployeeCommand, TimeSpan endHour)
        {
            return endHour >= addEmployeeCommand.StartHour + new TimeSpan(4, 0, 0);
        }

        private async Task<bool> BeHigherOrEqualThanSevenAM(TimeSpan startHour, CancellationToken cancellationToken)
        {
            return await Task.FromResult(startHour.Hours >= 7);
        }

        private async Task<bool> BeLowerOrEqualThanEightPM(TimeSpan endHour, CancellationToken cancellationToken)
        {
            return await Task.FromResult(endHour.Hours <= 20);
        }

        private async Task<bool> ExistsClinic(int clinicId, CancellationToken cancellationToken)
        {
            return await _context.Clinics.AnyAsync(x => x.Id == clinicId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsEmployeeType(short employeeTypeId, CancellationToken cancellationToken)
        {
            return await _context.EmployeeTypes.AnyAsync(x => x.Id == employeeTypeId && !x.Deleted, cancellationToken);
        }

        private bool HaveNoMedicalCheckTypeIfNotDoctor(UpdateEmployeeCommand employeeCommand, short employeeTypeId)
        {
            var doctorTypeId = GetDoctorTypeId();
            return employeeTypeId == doctorTypeId || !employeeCommand.MedicalCheckTypeId.HasValue;
        }

        private bool HaveMedicalCheckTypeIfDoctor(UpdateEmployeeCommand employeeCommand, short employeeTypeId)
        {
            var doctorTypeId = GetDoctorTypeId();
            return employeeTypeId != doctorTypeId || employeeCommand.MedicalCheckTypeId.HasValue;
        }

        private short GetDoctorTypeId()
        {
            return _context.EmployeeTypes.Single(x => x.Name == EmployeeTypeConstants.Doctor).Id;
        }
    }
}