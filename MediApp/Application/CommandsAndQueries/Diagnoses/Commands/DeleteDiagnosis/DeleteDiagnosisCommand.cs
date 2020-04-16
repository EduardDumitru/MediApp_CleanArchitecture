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
    public class DeleteDiagnosisCommand: IRequest<Result>
    {
        public short Id { get; set; }
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
            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid diagnosis found"});
            }

            var isUsedInMedicalCheck = entity.MedicalChecks.Any(x => !x.Deleted);

            if (isUsedInMedicalCheck)
            {
                return Result.Failure(new List<string> {"Diagnosis is used in medical checks. You can't delete it"});
            }

            var isUsedInDiagnosisXDrugs = entity.DiagnosisXDrugs.Any(x => !x.Deleted);

            if (isUsedInDiagnosisXDrugs)
            {
                return Result.Failure(new List<string> {"Diagnosis is linked to drugs. You can't delete it"});
            }

            return Result.Success();
        }
    }
}
