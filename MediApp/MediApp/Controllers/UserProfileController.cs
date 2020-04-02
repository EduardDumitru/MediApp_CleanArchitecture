using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Produces("application/json")]
    [Authorize]
    public class UserProfileController : ApiController
    {
        // GET
        [HttpPut]
        public async Task<IActionResult> UpdateUserProfile(UpdateUserProfileCommand command)
        {

            var response = await Mediator.Send(command);

            if (!response.Succeeded)
            {
                return BadRequest(response.Errors);
            }

            return Ok(response.SuccessMessage);
        }
    }
}