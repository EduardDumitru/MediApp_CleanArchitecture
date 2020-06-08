using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class DeleteHolidayIntervalCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class DeleteHolidayIntervalCommandHandler : IRequestHandler<DeleteHolidayIntervalCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteHolidayIntervalCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteHolidayIntervalCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.HolidayIntervals
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null) return Result.Failure(new List<string> {"No valid holiday interval found"});

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Holiday interval was deleted");
        }
    }
}