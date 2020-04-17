﻿using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries.Drugs.Commands.DeleteDrug
{
    public class DeleteDrugCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class DeleteDrugCommandHandler : IRequestHandler<DeleteDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteDrugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Drugs
                .Include(x => x.PrescriptionXDrugs)
                .Include(x => x.DiagnosisXDrugs)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Drug was deleted");
        }

        private Result Validations(Drug entity)
        {
            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid drug found"});
            }

            var isUsedInPrescriptionXDrugs = entity.PrescriptionXDrugs.Any(x => !x.Deleted);

            if (isUsedInPrescriptionXDrugs)
            {
                return Result.Failure(new List<string> {"Drug is linked to prescriptions. You can't delete it"});
            }

            var isUsedInDiagnosisXDrugs = entity.DiagnosisXDrugs.Any(x => !x.Deleted);

            if (isUsedInDiagnosisXDrugs)
            {
                return Result.Failure(new List<string> {"Drug is linked to diagnoses. You can't delete it"});
            }

            return Result.Success();
        }
    }
}