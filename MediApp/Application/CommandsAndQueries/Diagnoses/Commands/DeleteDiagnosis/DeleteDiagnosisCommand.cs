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
    public class DeleteDiagnosisCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class DeleteDiagnosisCommandHandler : IRequestHandler<DeleteDiagnosisCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteDiagnosisCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteDiagnosisCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Diagnoses
                .Include(x => x.MedicalChecks)
                .Include(x => x.DiagnosisXDrugs)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }
            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Diagnosis was deleted");
        }

        private Result Validations(Diagnosis entity)
        {
            var errors = new List<string>();

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid diagnosis found"});
            }

            var isUsedInMedicalCheck = entity.MedicalChecks.Any(x => !x.Deleted);

            if (isUsedInMedicalCheck)
            {
                errors.Add("Diagnosis is used in medical checks. You can't delete it while in use.");
            }

            var isUsedInDiagnosisXDrugs = entity.DiagnosisXDrugs.Any(x => !x.Deleted);

            if (isUsedInDiagnosisXDrugs)
            {
                errors.Add("Diagnosis is linked to drugs. You can't delete it while in use.");
            }

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}
