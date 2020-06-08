using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreCityCommandValidator : AbstractValidator<RestoreCityCommand>
    {
        public RestoreCityCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}