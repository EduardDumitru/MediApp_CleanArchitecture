using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;

namespace Application.Users.Commands.AddUser
{
    public class AddUserCommandValidator : AbstractValidator<AddUserCommand>
    {
        private readonly IIdentityService _identityService;

        public AddUserCommandValidator(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        
    }
}
