using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class LoginUserCommand : IRequest<AuthenticationResult>
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, AuthenticationResult>
    {
        private readonly IIdentityService _identityService;

        public LoginUserCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<AuthenticationResult> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            return await _identityService.LoginAsync(request);
        }
    }
}
