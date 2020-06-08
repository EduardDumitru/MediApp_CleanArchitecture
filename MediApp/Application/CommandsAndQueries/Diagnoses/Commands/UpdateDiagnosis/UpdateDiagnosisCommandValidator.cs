using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateDiagnosisCommandValidator : AbstractValidator<UpdateDiagnosisCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDiagnosisCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueDiagnosis).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueDiagnosis(UpdateDiagnosisCommand updateDiagnosisCommand, string name,
            CancellationToken cancellationToken)
        {
            return await _context.Diagnoses
                .Where(x => x.Id != updateDiagnosisCommand.Id)
                .AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}