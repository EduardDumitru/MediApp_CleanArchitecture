﻿using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class DeleteHolidayIntervalCommandValidator : AbstractValidator<DeleteHolidayIntervalCommand>
    {
        public DeleteHolidayIntervalCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}