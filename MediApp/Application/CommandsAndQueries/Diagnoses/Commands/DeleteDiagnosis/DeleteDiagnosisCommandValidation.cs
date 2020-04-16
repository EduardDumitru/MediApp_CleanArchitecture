using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteDiagnosisCommandValidation : AbstractValidator<DeleteDiagnosisCommand>
    {
        public DeleteDiagnosisCommandValidation()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
