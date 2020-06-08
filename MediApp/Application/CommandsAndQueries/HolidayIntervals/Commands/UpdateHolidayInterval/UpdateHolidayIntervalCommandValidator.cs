using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateHolidayIntervalCommandValidator : AbstractValidator<UpdateHolidayIntervalCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IDateTime _dateTime;

        public UpdateHolidayIntervalCommandValidator(IApplicationDbContext context, IDateTime dateTime)
        {
            _context = context;
            _dateTime = dateTime;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.StartDate)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Start date is required")
                .MustAsync(IsHigherThanCurrentDate).WithMessage("Start date must be after current date");
            RuleFor(x => x.EndDate)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("End date is required")
                .MustAsync(IsSmallerThanEndDate).WithMessage("Start date must be before end date or equal")
                .MustAsync(NoHolidayIntervalsInThisPeriod)
                .WithMessage("Employee has other holiday intervals in this period");
            RuleFor(x => x.EmployeeId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Employee is required")
                .MustAsync(ExistsEmployee).WithMessage("Employee is not valid")
                .MustAsync(NoMedicalChecksInThisPeriod).WithMessage("Employee has medical checks in this period");
        }

        private async Task<bool> NoMedicalChecksInThisPeriod(UpdateHolidayIntervalCommand holidayIntervalCommand,
            long employeeId, CancellationToken cancellationToken)
        {
            return !await _context.MedicalChecks.AnyAsync(x => x.EmployeeId == employeeId &&
                                                               x.Appointment.ToLocalTime().Date >=
                                                               holidayIntervalCommand.StartDate.ToLocalTime().Date &&
                                                               x.Appointment.ToLocalTime().Date <=
                                                               holidayIntervalCommand.EndDate.ToLocalTime().Date &&
                                                               !x.Deleted, cancellationToken);
        }

        private async Task<bool> NoHolidayIntervalsInThisPeriod(UpdateHolidayIntervalCommand holidayIntervalCommand,
            DateTime endDate, CancellationToken cancellationToken)
        {
            return !await _context.HolidayIntervals.AnyAsync(x =>
                x.StartDate.ToLocalTime().Date >= holidayIntervalCommand.StartDate.ToLocalTime().Date
                && x.EndDate.ToLocalTime().Date <= endDate && !x.Deleted, cancellationToken);
        }

        private async Task<bool> IsHigherThanCurrentDate(DateTime startDate, CancellationToken cancellationToken)
        {
            return await Task.FromResult(startDate.Date.ToLocalTime() > _dateTime.Now.Date);
        }

        private async Task<bool> IsSmallerThanEndDate(UpdateHolidayIntervalCommand holidayIntervalCommand,
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