using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreClinicCommandValidator : AbstractValidator<RestoreClinicCommand>
    {
        public RestoreClinicCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}