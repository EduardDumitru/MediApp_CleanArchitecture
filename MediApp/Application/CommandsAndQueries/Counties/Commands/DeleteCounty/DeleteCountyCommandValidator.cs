using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteCountyCommandValidator : AbstractValidator<DeleteCountyCommand>
    {
        public DeleteCountyCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
