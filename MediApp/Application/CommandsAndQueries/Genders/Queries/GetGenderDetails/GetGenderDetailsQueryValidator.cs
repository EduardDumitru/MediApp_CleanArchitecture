using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetGenderDetailsQueryValidator : AbstractValidator<GetGenderDetailsQuery>
    {
        public GetGenderDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}