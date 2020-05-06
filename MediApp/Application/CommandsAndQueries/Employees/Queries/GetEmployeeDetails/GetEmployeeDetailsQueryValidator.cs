using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetEmployeeDetailsQueryValidator : AbstractValidator<GetEmployeeTypeDetailsQuery>
    {
        public GetEmployeeDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}