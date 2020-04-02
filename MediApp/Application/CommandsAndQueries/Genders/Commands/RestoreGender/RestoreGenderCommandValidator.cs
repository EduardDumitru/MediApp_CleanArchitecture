using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Application.CommandsAndQueries.Genders.Commands.RestoreGender
{
    public class RestoreGenderCommandValidator : AbstractValidator<RestoreGenderCommand>
    {
        public RestoreGenderCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
