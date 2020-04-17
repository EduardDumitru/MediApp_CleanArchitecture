using System.Linq;
using Application.Common.Interfaces;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class UpdateMedicalCheckTypeCommandValidator : AbstractValidator<UpdateMedicalCheckTypeCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateMedicalCheckTypeCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .Must(BeUniqueMedicalCheckType).WithMessage("Name already exists");
        }

        private bool BeUniqueMedicalCheckType(UpdateMedicalCheckTypeCommand updateDrugCommand, string name)
        {
            return _context.Drugs
                .Where(x => x.Id != updateDrugCommand.Id)
                .All(x => x.Name != name);
        }
    }
}