using System;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Constants;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddEmployeeCommandValidator : AbstractValidator<AddEmployeeCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddEmployeeCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.UserProfileId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("User is required")
                .MustAsync(BeUniqueUserProfile).WithMessage("User is already an employee")
                .MustAsync(ExistsUserProfile).WithMessage("User is not valid");
            RuleFor(x => x.ClinicId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Clinic is required")
                .MustAsync(ExistsClinic).WithMessage("Clinic is not valid");
            RuleFor(x => x.EmployeeTypeId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Employee Type is required")
                .MustAsync(ExistsEmployeeType).WithMessage("Employee Type is not valid")
                .MustAsync(HaveNoMedicalCheckTypeIfNotDoctor).WithMessage("Only doctors can have medical check type")
                .MustAsync(HaveMedicalCheckTypeIfDoctor).WithMessage("Medical Check Type is required for doctor");
            RuleFor(x => x.StartHour)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Start Hour is required")
                .MustAsync(BeValidTimeSpan).WithMessage("Start Hour is not valid")
                .MustAsync(BeFromHalfToHalfHours)
                .WithMessage("Start Hour must be from half to half hours. Example: 09:00 or 09:30");
            RuleFor(x => x.EndHour)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("End Hour is required")
                .MustAsync(BeValidTimeSpan).WithMessage("End Hour is not valid")
                .MustAsync(BeFromHalfToHalfHours)
                .WithMessage("End Hour must be from half to half hours. Example: 09:00 or 09:30")
                .MustAsync(BeHigherThanStartHourByAtLeastFourHours)
                .WithMessage("End Hour must be higher than Start Hour by at least four hours");
        }

        private async Task<bool> BeValidTimeSpan(string time, CancellationToken cancellationToken)
        {
            var result = await Task.FromResult(TimeSpan.TryParseExact(time, "h\\:mm\\:ss", CultureInfo.CurrentCulture,
                TimeSpanStyles.None,
                out _));
            return result;
        }

        private async Task<bool> BeFromHalfToHalfHours(string hours, CancellationToken cancellationToken)
        {
            if (TimeSpan.TryParseExact(hours, "h\\:mm\\:ss", CultureInfo.CurrentCulture,
                TimeSpanStyles.None,
                out var result))
                return await Task.FromResult(result.Minutes == 0 || result.Minutes == 30);

            return await Task.FromResult(false);
        }

        private async Task<bool> BeHigherThanStartHourByAtLeastFourHours(AddEmployeeCommand addEmployeeCommand,
            string endHour,
            CancellationToken cancellationToken)
        {
            if (TimeSpan.TryParseExact(endHour, "h\\:mm\\:ss", CultureInfo.CurrentCulture,
                TimeSpanStyles.None,
                out var endHours) && TimeSpan.TryParseExact(addEmployeeCommand.StartHour, "h\\:mm\\:ss",
                CultureInfo.CurrentCulture,
                TimeSpanStyles.None,
                out var startHours))
                return await Task.FromResult(endHours >= startHours + new TimeSpan(4, 0, 0));

            return await Task.FromResult(false);
        }

        private async Task<bool> BeUniqueUserProfile(long userProfileId, CancellationToken cancellationToken)
        {
            return await _context.Employees.AllAsync(x => x.UserProfileId != userProfileId, cancellationToken);
        }

        private async Task<bool> ExistsUserProfile(long userProfileId, CancellationToken cancellationToken)
        {
            return await _context.UserProfiles.AnyAsync(x => x.Id == userProfileId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsClinic(int clinicId, CancellationToken cancellationToken)
        {
            return await _context.Clinics.AnyAsync(x => x.Id == clinicId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsEmployeeType(short employeeTypeId, CancellationToken cancellationToken)
        {
            return await _context.EmployeeTypes.AnyAsync(x => x.Id == employeeTypeId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> HaveNoMedicalCheckTypeIfNotDoctor(AddEmployeeCommand employeeCommand, short employeeTypeId,
            CancellationToken cancellationToken)
        {
            var doctorTypeId = await GetDoctorTypeId(cancellationToken);
            return employeeTypeId == doctorTypeId || !employeeCommand.MedicalCheckTypeId.HasValue;
        }

        private async Task<bool> HaveMedicalCheckTypeIfDoctor(AddEmployeeCommand employeeCommand, short employeeTypeId,
            CancellationToken cancellationToken)
        {
            var doctorTypeId = await GetDoctorTypeId(cancellationToken);
            return employeeTypeId != doctorTypeId || employeeCommand.MedicalCheckTypeId.HasValue;
        }

        private async Task<short> GetDoctorTypeId(CancellationToken cancellationToken)
        {
            return (await _context.EmployeeTypes.SingleAsync(x => x.Name == EmployeeTypeConstants.Doctor, cancellationToken)).Id;
        }
    }
}