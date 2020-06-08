using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetClinicDetailsQueryValidator : AbstractValidator<GetClinicDetailsQuery>
    {
        public GetClinicDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}