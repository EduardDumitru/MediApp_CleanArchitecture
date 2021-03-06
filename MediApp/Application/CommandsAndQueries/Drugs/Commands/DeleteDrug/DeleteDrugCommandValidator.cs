﻿using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteDrugCommandValidator : AbstractValidator<DeleteDrugCommand>
    {
        public DeleteDrugCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}