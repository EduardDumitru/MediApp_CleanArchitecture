﻿using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Application.CommandsAndQueries
{ 
    public class RestoreCountyCommandValidator : AbstractValidator<RestoreCountyCommand>
    {
        public RestoreCountyCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
