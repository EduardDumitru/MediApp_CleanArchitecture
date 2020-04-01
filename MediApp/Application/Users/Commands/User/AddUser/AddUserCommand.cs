﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;

namespace Application.Users.Commands.User.AddUser
{
    public class AddUserCommand : IRequest<AuthenticationResult>
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNo { get; set; }
        public string CNP { get; set; }
        public string PhoneNumber { get; set; }
        public short CountryId { get; set; }
        public int CountyId { get; set; }
        public int CityId { get; set; }
        public short GenderId { get; set; }
    }
    public class AddUserCommandHandler : IRequestHandler<AddUserCommand, AuthenticationResult>
    {
        private readonly IIdentityService _identityService;

        public AddUserCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<AuthenticationResult> Handle(AddUserCommand request, CancellationToken cancellationToken)
        {
            return await _identityService.RegisterAsync(request);
        }
    }
}
