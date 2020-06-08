using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateDrugCommandValidator : AbstractValidator<UpdateDrugCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDrugCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueDrug).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueDrug(UpdateDrugCommand updateDrugCommand, string name,
            CancellationToken cancellationToken)
        {
            return await _context.Drugs
                .Where(x => x.Id != updateDrugCommand.Id)
                .AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}