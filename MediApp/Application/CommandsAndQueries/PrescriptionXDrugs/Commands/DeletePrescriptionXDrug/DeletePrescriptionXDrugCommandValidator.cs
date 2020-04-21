using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeletePrescriptionXDrugCommandValidator : AbstractValidator<DeletePrescriptionXDrugCommand>
    {
        public DeletePrescriptionXDrugCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}