using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetMedicalCheckDetailsQueryValidator : AbstractValidator<GetMedicalCheckDetailsQuery>
    {
        public GetMedicalCheckDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}