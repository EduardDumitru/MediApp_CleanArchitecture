using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddDiagnosisXDrugCommandValidator : AbstractValidator<AddDiagnosisXDrugCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddDiagnosisXDrugCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.DiagnosisId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Diagnosis is required")
                .MustAsync(ExistsDiagnosis).WithMessage("Diagnosis is not valid");
            RuleFor(x => x.DrugId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Drug is required")
                .MustAsync(ExistsDrug).WithMessage("Drug is not valid")
                .Must(NoExistingLinkBetweenDiagnosisAndDrug).WithMessage("Link already exists");
        }

        private bool NoExistingLinkBetweenDiagnosisAndDrug(AddDiagnosisXDrugCommand addDiagnosisXDrugCommand,
            long drugId)
        {
            return _context.DiagnosisXDrugs.All(x =>
                x.DrugId != drugId && x.DiagnosisId != addDiagnosisXDrugCommand.DiagnosisId);
        }

        private async Task<bool> ExistsDrug(long drugId, CancellationToken cancellationToken)
        {
            return await _context.Drugs
                .AnyAsync(x => x.Id == drugId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsDiagnosis(int diagnosisId, CancellationToken cancellationToken)
        {
            return await _context.Diagnoses
                .AnyAsync(x => x.Id == diagnosisId && !x.Deleted, cancellationToken);
        }
    }
}