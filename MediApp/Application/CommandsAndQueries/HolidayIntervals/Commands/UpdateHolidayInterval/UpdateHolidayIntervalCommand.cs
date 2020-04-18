using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateHolidayIntervalCommand : IRequest<Result>
    {
        public long Id { get; set; }
        public long EmployeeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class UpdateHolidayIntervalCommandHandler : IRequestHandler<UpdateHolidayIntervalCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateHolidayIntervalCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateHolidayIntervalCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.HolidayIntervals
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid holiday interval found"});
            }

            entity.StartDate = request.StartDate;
            entity.EndDate = request.EndDate;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Holiday Interval update was successful");
        }
    }
}