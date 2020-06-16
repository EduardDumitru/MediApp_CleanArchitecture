using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreHolidayIntervalCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class RestoreHolidayIntervalCommandHandler : IRequestHandler<RestoreHolidayIntervalCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        private readonly IDateTime _dateTime;

        public RestoreHolidayIntervalCommandHandler(IApplicationDbContext context, IDateTime dateTime)
        {
            _context = context;
            _dateTime = dateTime;
        }

        public async Task<Result> Handle(RestoreHolidayIntervalCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.HolidayIntervals
                .Include(x => x.Employee)
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);

            var validationResult = await Validations(entity, cancellationToken);
            if (!validationResult.Succeeded) return validationResult;

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Holiday interval was restored");
        }

        private async Task<Result> Validations(HolidayInterval entity, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (entity == null) return Result.Failure(new List<string> {"No valid holiday interval found"});

            var dateNow = _dateTime.Now.Date;

            var isInPast = entity.EndDate.Date <= dateNow ||
                           entity.EndDate.Date > dateNow && entity.StartDate.Date <= dateNow;

            if (isInPast) errors.Add("Holiday interval is in past. You can't restore it!");

            if (entity.Employee == null || entity.Employee != null && entity.Employee.Deleted)
                errors.Add("Employee is deleted. You must update that first.");

            var startDate = entity.StartDate.Date;
            var localEndDate = entity.EndDate.Date;
            var res = !await _context.HolidayIntervals.AnyAsync(x =>
                    x.StartDate.Date >= startDate
                    && x.EndDate.Date <= localEndDate
                    && !x.Deleted
                    && x.EmployeeId == entity.EmployeeId,
                    cancellationToken);
            if (res == false)
            {
                errors.Add("Employee has other holiday intervals in this period");
            }
            res = !await _context.MedicalChecks.AnyAsync(x => x.EmployeeId == entity.EmployeeId &&
                                                              x.Appointment.Date >= startDate
                                                              && x.Appointment.Date <= localEndDate
                                                              && !x.Deleted, cancellationToken);
            if (res == false)
            {
                errors.Add("Employee has medical checks in this period");
            }
            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}