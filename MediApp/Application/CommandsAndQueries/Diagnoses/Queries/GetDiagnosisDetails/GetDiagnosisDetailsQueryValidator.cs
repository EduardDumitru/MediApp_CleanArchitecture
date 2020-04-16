using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;
using FluentValidation.Validators;

namespace Application.CommandsAndQueries
{
    public class GetDiagnosisDetailsQueryValidator : AbstractValidator<GetDiagnosisDetailsQuery>
    {
        public GetDiagnosisDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
