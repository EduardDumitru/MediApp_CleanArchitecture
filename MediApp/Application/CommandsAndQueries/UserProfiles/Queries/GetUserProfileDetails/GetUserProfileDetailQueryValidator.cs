using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class GetUserProfileDetailQueryValidator : AbstractValidator<GetUserProfileDetailQuery>
    {
        public GetUserProfileDetailQueryValidator()
        {
            RuleFor(v => v.Id).NotEmpty();
        }
    }
}
