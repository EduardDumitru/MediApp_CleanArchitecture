using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteGenderCommandValidator : AbstractValidator<DeleteGenderCommand>
    {
        public DeleteGenderCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}