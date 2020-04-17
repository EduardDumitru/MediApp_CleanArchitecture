using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreDrugCommandValidator : AbstractValidator<RestoreDrugCommand>
    {
        public RestoreDrugCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}