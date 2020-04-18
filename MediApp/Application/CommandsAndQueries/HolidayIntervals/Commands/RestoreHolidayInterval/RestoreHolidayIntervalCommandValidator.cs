using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreHolidayIntervalCommandValidator : AbstractValidator<RestoreHolidayIntervalCommand>
    {
        public RestoreHolidayIntervalCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}