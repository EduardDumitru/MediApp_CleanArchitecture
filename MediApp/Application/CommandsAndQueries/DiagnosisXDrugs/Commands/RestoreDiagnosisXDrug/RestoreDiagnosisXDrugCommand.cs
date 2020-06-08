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
    public class RestoreDiagnosisXDrugCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class RestoreDiagnosisXDrugCommandHandler : IRequestHandler<RestoreDiagnosisXDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreDiagnosisXDrugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreDiagnosisXDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.DiagnosisXDrugs
                .Include(x => x.Diagnosis)
                .Include(x => x.Drug)
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded) return validationResult;

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Link between diagnosis and drug was restored");
        }

        private Result Validations(DiagnosisXDrug entity)
        {
            var errors = new List<string>();

            if (entity == null)
                return Result.Failure(new List<string> {"No valid link between diagnosis and drug found"});

            if (entity.Diagnosis == null || entity.Diagnosis != null && entity.Diagnosis.Deleted)
                errors.Add("Diagnosis is deleted. You must update that first.");

            if (entity.Drug == null || entity.Drug != null && entity.Drug.Deleted)
                errors.Add("Drug is deleted. You must update that first.");

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}