using System.Linq;
using Application.Common.Interfaces;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class AddMedicalCheckTypeCommandValidator : AbstractValidator<AddMedicalCheckTypeCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddMedicalCheckTypeCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .Must(BeUniqueMedicalCheckType).WithMessage("Name already exists");
        }

        private bool BeUniqueMedicalCheckType(AddMedicalCheckTypeCommand addMedicalCheckTypeCommand, string name)
        {
            return _context.MedicalCheckTypes.All(x => x.Name != name);
        }
    }
}