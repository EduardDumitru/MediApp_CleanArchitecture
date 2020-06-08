using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteClinicCommandValidator : AbstractValidator<DeleteClinicCommand>
    {
        public DeleteClinicCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}