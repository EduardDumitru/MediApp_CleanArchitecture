using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeletePrescriptionCommandValidator : AbstractValidator<DeletePrescriptionCommand>
    {
        public DeletePrescriptionCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}