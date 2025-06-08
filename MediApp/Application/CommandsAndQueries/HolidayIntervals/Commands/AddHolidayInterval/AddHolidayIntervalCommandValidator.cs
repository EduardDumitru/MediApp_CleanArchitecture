using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

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
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Start date is required")
                .MustAsync(IsHigherThanCurrentDate).WithMessage("Start date must be after current date");
            RuleFor(x => x.EndDate)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("End date is required")
                .MustAsync(IsSmallerThanEndDate).WithMessage("Start date must be before end date or equal")
                .MustAsync(NoHolidayIntervalsInThisPeriod)
                .WithMessage("Employee has other holiday intervals in this period");
            RuleFor(x => x.EmployeeId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Employee is required")
                .MustAsync(ExistsEmployee).WithMessage("Employee is not valid")
                .MustAsync(NoMedicalChecksInThisPeriod).WithMessage("Employee has medical checks in this period");
        }

        private async Task<bool> NoMedicalChecksInThisPeriod(AddHolidayIntervalCommand holidayIntervalCommand, long employeeId,
            CancellationToken cancellationToken)
        {
            var startDate = holidayIntervalCommand.StartDate.ToLocalTime().Date;
            var localEndDate = holidayIntervalCommand.EndDate.ToLocalTime().Date;

            return !await _context.MedicalChecks.AnyAsync(x => x.EmployeeId == employeeId &&
                                                               x.Appointment.Date >= startDate
                                                               && x.Appointment.Date <= localEndDate
                                                               && !x.Deleted, cancellationToken);
        }

        private async Task<bool> NoHolidayIntervalsInThisPeriod(AddHolidayIntervalCommand holidayIntervalCommand,
            DateTime endDate, CancellationToken cancellationToken)
        {
            var startDate = holidayIntervalCommand.StartDate.ToLocalTime().Date;
            var localEndDate = endDate.ToLocalTime().Date;
            var res = !await _context.HolidayIntervals.AnyAsync(x =>
                    x.StartDate.Date >= startDate
                    && x.EndDate.Date <= localEndDate
                    && !x.Deleted
                    && x.EmployeeId == holidayIntervalCommand.EmployeeId
                , cancellationToken);
            return res;
        }

        private async Task<bool> IsHigherThanCurrentDate(DateTime startDate, CancellationToken cancellationToken)
        {
            return await Task.FromResult(startDate.ToLocalTime().Date > _dateTime.Now.Date);
        }

        private async Task<bool> IsSmallerThanEndDate(AddHolidayIntervalCommand holidayIntervalCommand,
            DateTime endDate, CancellationToken cancellationToken)
        {
            return await Task.FromResult(endDate.ToLocalTime() >= holidayIntervalCommand.StartDate.ToLocalTime());
        }

        private async Task<bool> ExistsEmployee(long employeeId, CancellationToken cancellationToken)
        {
            return await _context.Employees
                .AnyAsync(x => x.Id == employeeId && !x.Deleted, cancellationToken);
        }
    }
}