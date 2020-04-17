using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreEmployeeTypeCommandValidator : AbstractValidator<RestoreEmployeeTypeCommand>
    {
        public RestoreEmployeeTypeCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}