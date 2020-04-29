using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteMedicalCheckCommandValidator : AbstractValidator<DeleteMedicalCheckCommand>
    {
        public DeleteMedicalCheckCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}