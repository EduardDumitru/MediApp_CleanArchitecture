using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetMedicalCheckTypeDetailsQueryValidator : AbstractValidator<GetMedicalCheckTypeDetailsQuery>
    {
        public GetMedicalCheckTypeDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}