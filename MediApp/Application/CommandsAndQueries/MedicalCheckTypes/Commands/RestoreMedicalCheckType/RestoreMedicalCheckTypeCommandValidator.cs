using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreMedicalCheckTypeCommandValidator : AbstractValidator<RestoreMedicalCheckTypeCommand>
    {
        public RestoreMedicalCheckTypeCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}