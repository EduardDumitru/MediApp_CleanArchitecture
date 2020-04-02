using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Models.Authentication;
using Application.Users.Commands.User.AddUser;
using Application.Users.Commands.User.LoginUser;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Produces("application/json")]
    public class UserController : ApiController
    {
        [HttpPost("adduser")]
        public async Task<IActionResult> AddUser([FromBody] AddUserCommand command)
        {
            var authResponse = await Mediator.Send(command);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token
            });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserCommand command)
        {
            var authResponse = await Mediator.Send(command);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
            });
        }
    }
}
