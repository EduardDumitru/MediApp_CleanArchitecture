using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddMedicalCheckTypeCommandValidator : AbstractValidator<AddMedicalCheckTypeCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddMedicalCheckTypeCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueMedicalCheckType).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueMedicalCheckType(string name, CancellationToken cancellationToken)
        {
            return await _context.MedicalCheckTypes.AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}