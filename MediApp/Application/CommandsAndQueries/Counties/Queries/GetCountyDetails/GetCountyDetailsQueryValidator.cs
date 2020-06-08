using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetCountyDetailsQueryValidator : AbstractValidator<GetCountyDetailsQuery>
    {
        public GetCountyDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}