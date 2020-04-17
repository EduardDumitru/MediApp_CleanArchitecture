using System.Linq;
using Application.Common.Interfaces;
using FluentValidation;

namespace Application.CommandsAndQueries.Drugs.Commands.UpdateDrug
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
                .Must(BeUniqueDrug).WithMessage("Name already exists");
        }

        private bool BeUniqueDrug(UpdateDrugCommand updateDrugCommand, string name)
        {
            return _context.Drugs
                .Where(x => x.Id != updateDrugCommand.Id)
                .All(x => x.Name != name);
        }
    }
}