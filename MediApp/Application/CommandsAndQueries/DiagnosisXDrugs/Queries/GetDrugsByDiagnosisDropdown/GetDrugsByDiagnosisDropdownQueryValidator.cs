using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetDrugsByDiagnosisDropdownQueryValidator : AbstractValidator<GetDrugsByDiagnosisDropdownQuery>
    {
        public GetDrugsByDiagnosisDropdownQueryValidator()
        {
            RuleFor(x => x.DiagnosisId)
                .NotEmpty().WithMessage("Diagnosis Id is required");
        }
    }
}