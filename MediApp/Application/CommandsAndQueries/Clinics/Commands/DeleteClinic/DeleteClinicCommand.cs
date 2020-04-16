using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class DeleteClinicCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class DeleteClinicCommandHandler : IRequestHandler<DeleteClinicCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteClinicCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteClinicCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Clinics
                .Include(x => x.Employees)
                .Include(x => x.MedicalChecks)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Clinic was deleted");
        }

        private Result Validations(Clinic entity)
        {
            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid clinic found"});
            }

            var isUsedInEmployee = entity.Employees.Any(x => !x.Deleted);

            if (isUsedInEmployee)
            {
                return Result.Failure(new List<string> {"Clinic is used in employees. You can't delete it"});
            }

            var isUsedInMedicalCheck = entity.MedicalChecks.Any(x => !x.Deleted);

            if (isUsedInMedicalCheck)
            {
                return Result.Failure(new List<string> {"Clinic is used in medical checks. You can't delete it"});
            }

            return Result.Success();
        }
    }
}
