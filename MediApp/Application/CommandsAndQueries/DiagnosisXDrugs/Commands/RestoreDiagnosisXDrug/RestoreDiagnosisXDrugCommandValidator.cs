using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreDiagnosisXDrugCommandValidator : AbstractValidator<RestoreDiagnosisXDrugCommand>
    {
        public RestoreDiagnosisXDrugCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}