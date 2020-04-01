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
        private readonly IApplicationDbContext _context;

        public AddUserCommandValidator(IApplicationDbContext context)
        {
            _context = context;
        }

        
    }
}
