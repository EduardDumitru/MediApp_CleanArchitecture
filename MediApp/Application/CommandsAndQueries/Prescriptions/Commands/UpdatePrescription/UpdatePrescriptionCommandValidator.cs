using Application.Common.Interfaces;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class UpdatePrescriptionCommandValidator : AbstractValidator<UpdatePrescriptionCommand>
    {
        public UpdatePrescriptionCommandValidator()
        {
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}