using System.Linq;
using Application.Common.Interfaces;
using FluentValidation;

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
                .Must(BeUniqueDrug).WithMessage("Name already exists");
        }

        private bool BeUniqueDrug(AddDrugCommand updateDrugCommand, string name)
        {
            return _context.Drugs.All(x => x.Name != name);
        }
    }
}