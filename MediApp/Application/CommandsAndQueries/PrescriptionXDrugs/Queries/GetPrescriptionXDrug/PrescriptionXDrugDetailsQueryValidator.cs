using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetPrescriptionXDrugDetailsQueryValidator : AbstractValidator<GetPrescriptionXDrugDetailsQuery>
    {
        public GetPrescriptionXDrugDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}