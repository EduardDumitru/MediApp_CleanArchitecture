using FluentValidation;

namespace Application.CommandsAndQueries.EmployeeTypes.Commands.DeleteEmployeeType
{
    public class DeleteEmployeeTypeCommandValidator : AbstractValidator<DeleteEmployeeTypeCommand>
    {
        public DeleteEmployeeTypeCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}