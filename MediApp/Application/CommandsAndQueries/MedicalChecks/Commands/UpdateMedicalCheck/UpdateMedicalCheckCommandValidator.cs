using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateMedicalCheckCommandValidator : AbstractValidator<UpdateMedicalCheckCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateMedicalCheckCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.DiagnosisId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Diagnosis is required")
                .MustAsync(ExistsDiagnosis).WithMessage("Diagnosis is not valid");
        }

        private async Task<bool> ExistsDiagnosis(int diagnosisId, CancellationToken cancellationToken)
        {
            return await _context.Diagnoses
                .AnyAsync(x => x.Id == diagnosisId && !x.Deleted, cancellationToken);
        }
    }
}