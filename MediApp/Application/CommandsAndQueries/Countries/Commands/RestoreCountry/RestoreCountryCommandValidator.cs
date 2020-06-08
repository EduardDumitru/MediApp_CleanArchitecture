using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreCountryCommandValidator : AbstractValidator<RestoreCountryCommand>
    {
        public RestoreCountryCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}