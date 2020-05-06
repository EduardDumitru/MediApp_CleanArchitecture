using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreEmployeeCommandValidator : AbstractValidator<RestoreEmployeeCommand>
    {
        public RestoreEmployeeCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}