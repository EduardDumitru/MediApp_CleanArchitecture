using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteCountryCommandValidator : AbstractValidator<DeleteCountryCommand>
    {
        public DeleteCountryCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
