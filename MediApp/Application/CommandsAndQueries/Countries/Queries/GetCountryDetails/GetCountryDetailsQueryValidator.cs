using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetCountryDetailsQueryValidator : AbstractValidator<GetCountryDetailsQuery>
    {
        public GetCountryDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");
        }
    }
}
