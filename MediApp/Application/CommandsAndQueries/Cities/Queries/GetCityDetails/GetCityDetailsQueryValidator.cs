using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetCityDetailsQueryValidator : AbstractValidator<GetCityDetailsQuery>
    {
        public GetCityDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
