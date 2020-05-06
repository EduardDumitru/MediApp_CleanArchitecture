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
    public class DeleteEmployeeCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteEmployeeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Employees
                .Include(x => x.MedicalChecks)
                .Include(x => x.Prescriptions)
                .Include(x => x.HolidayIntervals)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Employee was deleted");
        }

        private Result Validations(Employee entity)
        {
            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid employee found"});
            }

            var isUsedInHolidayIntervals = entity.HolidayIntervals.Any(x => !x.Deleted);

            if (isUsedInHolidayIntervals)
            {
                return Result.Failure(new List<string> {"Employee is used in holiday intervals. You can't delete it"});
            }

            var isUsedInMedicalChecks = entity.MedicalChecks.Any(x => !x.Deleted);

            if (isUsedInMedicalChecks)
            {
                return Result.Failure(new List<string>
                    {"Employee is used in medical checks. You can't delete it"});
            }

            var isUsedInPrescriptions = entity.Prescriptions.Any(x => !x.Deleted);

            if (isUsedInPrescriptions)
            {
                return Result.Failure(new List<string>
                    {"Employee is used in prescriptions. You can't delete it"});
            }

            return Result.Success();
        }
    }
}