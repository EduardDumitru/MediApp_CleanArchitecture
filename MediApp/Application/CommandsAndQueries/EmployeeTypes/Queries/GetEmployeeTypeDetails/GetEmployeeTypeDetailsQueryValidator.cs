using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetEmployeeTypeDetailsQueryValidator : AbstractValidator<GetEmployeeTypeDetailsQuery>
    {
        public GetEmployeeTypeDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}