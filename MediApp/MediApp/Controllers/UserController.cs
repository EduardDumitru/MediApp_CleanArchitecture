using Application.CommandsAndQueries;
using Application.Common.Models.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MediApp.Controllers
{
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
