using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetDiagnosisDetailsQueryValidator : AbstractValidator<GetDiagnosisDetailsQuery>
    {
        public GetDiagnosisDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}