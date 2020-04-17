using System;
using System.Collections.Generic;
using System.Text;
using Application.CommandsAndQueries.Diagnoses;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class RestoreDiagnosisCommandValidator : AbstractValidator<RestoreDiagnosisCommand>
    {
        public RestoreDiagnosisCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
