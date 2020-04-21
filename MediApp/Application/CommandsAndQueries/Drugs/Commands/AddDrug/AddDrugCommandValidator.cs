using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddDrugCommandValidator : AbstractValidator<AddDrugCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddDrugCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueDrug).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueDrug(string name, CancellationToken cancellationToken)
        {
            return await _context.Drugs.AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}