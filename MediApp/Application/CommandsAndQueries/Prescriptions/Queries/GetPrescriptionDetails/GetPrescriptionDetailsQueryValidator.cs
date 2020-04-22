using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetPrescriptionDetailsQueryValidator : AbstractValidator<GetPrescriptionDetailsQuery>
    {
        public GetPrescriptionDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}