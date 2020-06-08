using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetUserProfileDetailQueryValidator : AbstractValidator<GetUserProfileDetailQuery>
    {
        public GetUserProfileDetailQueryValidator()
        {
            RuleFor(v => v.Id).NotEmpty().WithMessage("Id is required.");
        }
    }
}