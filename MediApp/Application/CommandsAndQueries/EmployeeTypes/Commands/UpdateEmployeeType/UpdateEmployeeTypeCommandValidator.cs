using System.Linq;
using Application.Common.Interfaces;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class UpdateEmployeeTypeCommandValidator : AbstractValidator<UpdateEmployeeTypeCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateEmployeeTypeCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .Must(BeUniqueEmployeeType).WithMessage("Name already exists");
        }

        private bool BeUniqueEmployeeType(UpdateEmployeeTypeCommand updateEmployeeTypeCommand, string name)
        {
            return _context.EmployeeTypes
                .Where(x => x.Id != updateEmployeeTypeCommand.Id)
                .All(x => x.Name != name);
        }
    }
}