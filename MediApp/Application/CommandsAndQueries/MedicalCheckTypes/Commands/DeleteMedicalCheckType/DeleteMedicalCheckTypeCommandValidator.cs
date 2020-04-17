using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteMedicalCheckTypeCommandValidator : AbstractValidator<DeleteMedicalCheckTypeCommand>
    {
        public DeleteMedicalCheckTypeCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}