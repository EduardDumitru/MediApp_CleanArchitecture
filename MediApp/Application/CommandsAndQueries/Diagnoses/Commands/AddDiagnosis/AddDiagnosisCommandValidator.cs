using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddDiagnosisCommandValidator : AbstractValidator<AddDiagnosisCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddDiagnosisCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueDiagnosis).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueDiagnosis(string name, CancellationToken cancellationToken)
        {
            return await _context.Diagnoses.AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}