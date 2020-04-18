using System.Collections.Generic;
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
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Holiday interval was restored");
        }

        private Result Validations(HolidayInterval entity)
        {
            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid holiday interval found"});
            }

            var dateNow = _dateTime.Now.Date;

            var isInPast = entity.EndDate.Date <= dateNow || entity.EndDate.Date > dateNow && entity.StartDate.Date <= dateNow;

            if (isInPast)
            {
                return Result.Failure(new List<string> {"Holiday interval is in past. You can't restore it!"});
            }

            return Result.Success();
        }
    }
}