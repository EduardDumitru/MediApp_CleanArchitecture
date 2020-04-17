using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetDrugDetailsQueryValidator : AbstractValidator<GetDrugDetailsQuery>
    {
        public GetDrugDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}