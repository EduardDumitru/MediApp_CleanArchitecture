using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetHolidayIntervalDetailsQueryValidator : AbstractValidator<GetHolidayIntervalDetailsQuery>
    {
        public GetHolidayIntervalDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}