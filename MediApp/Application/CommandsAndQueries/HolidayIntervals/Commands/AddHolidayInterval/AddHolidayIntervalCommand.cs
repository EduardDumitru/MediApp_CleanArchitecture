using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddHolidayIntervalCommand : IRequest<Result>
    {
        public long EmployeeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class AddHolidayIntervalCommandHandler : IRequestHandler<AddHolidayIntervalCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddHolidayIntervalCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddHolidayIntervalCommand request, CancellationToken cancellationToken)
        {
            var entity = new HolidayInterval
            {
                EmployeeId = request.EmployeeId,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            await _context.HolidayIntervals.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Holiday interval was created successfully");
        }
    }
}