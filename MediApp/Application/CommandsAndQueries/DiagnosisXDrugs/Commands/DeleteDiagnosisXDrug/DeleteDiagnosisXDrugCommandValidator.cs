using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteDiagnosisXDrugCommandValidator : AbstractValidator<DeleteDiagnosisXDrugCommand>
    {
        public DeleteDiagnosisXDrugCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}