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
                .MustAsync(NoExistingLinkBetweenDiagnosisAndDrug).WithMessage("Link already exists");
        }

        private async Task<bool> NoExistingLinkBetweenDiagnosisAndDrug(AddDiagnosisXDrugCommand addDiagnosisXDrugCommand,
            long drugId, CancellationToken cancellationToken)
        {
            return await _context.DiagnosisXDrugs.AllAsync(x =>
                x.DrugId != drugId && x.DiagnosisId != addDiagnosisXDrugCommand.DiagnosisId, cancellationToken);
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