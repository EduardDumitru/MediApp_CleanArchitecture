using System;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace Application.CommandsAndQueries
{
    public class AddHolidayIntervalCommandValidator : AbstractValidator<AddHolidayIntervalCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IDateTime _dateTime;

        public AddHolidayIntervalCommandValidator(IApplicationDbContext context, IDateTime dateTime)
        {
            _context = context;
            _dateTime = dateTime;
            RuleFor(x => x.StartDate)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Start date is required")
                .MustAsync(IsHigherThanCurrentDate).WithMessage("Start date must be after current date");
            RuleFor(x => x.EndDate)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("End date is required")
                .Must(IsSmallerThanEndDate).WithMessage("Start date must be before end date or equal")
                .Must(NoHolidayIntervalsInThisPeriod).WithMessage("Employee has other holiday intervals in this period");
            RuleFor(x => x.EmployeeId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Employee is required")
                .MustAsync(ExistsEmployee).WithMessage("Employee is not valid")
                .Must(NoMedicalChecksInThisPeriod).WithMessage("Employee has medical checks in this period");
        }

        private bool NoMedicalChecksInThisPeriod(AddHolidayIntervalCommand holidayIntervalCommand, long employeeId)
        {
            return _context.MedicalChecks.Any(x => x.EmployeeId == employeeId &&
                x.Appointment >= holidayIntervalCommand.StartDate.ToLocalTime() &&
                x.Appointment <= holidayIntervalCommand.EndDate.ToLocalTime() &&
                !x.Deleted);
        }

        private bool NoHolidayIntervalsInThisPeriod(AddHolidayIntervalCommand holidayIntervalCommand,
            DateTime endDate)
        {
            return _context.HolidayIntervals.Any(x =>
                x.StartDate.ToLocalTime() >= holidayIntervalCommand.StartDate.ToLocalTime() 
                && x.EndDate.ToLocalTime() <= endDate.ToLocalTime());
        }

        private async Task<bool> IsHigherThanCurrentDate(DateTime startDate, CancellationToken cancellationToken)
        {
            return await Task.FromResult(startDate.ToLocalTime().Date > _dateTime.Now.Date);
        }

        private bool IsSmallerThanEndDate(AddHolidayIntervalCommand holidayIntervalCommand,
            DateTime endDate)
        {
            return endDate.ToLocalTime() >= holidayIntervalCommand.StartDate.ToLocalTime();
        }

        private async Task<bool> ExistsEmployee(long employeeId, CancellationToken cancellationToken)
        {
            return await _context.Employees
                .AnyAsync(x => x.Id == employeeId && !x.Deleted, cancellationToken);
        }
    }
}