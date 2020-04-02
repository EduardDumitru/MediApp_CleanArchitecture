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

        [HttpGet]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<UserProfileListVm>> GetUserProfiles()
        {
            var vm = await Mediator.Send(new GetUserProfilesListQuery());

            return Ok(vm);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileListVm>> GetUserProfile(long id)
        {
            var vm = await Mediator.Send(new GetUserProfileDetailQuery() {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid user profile was found");
            }

            return Ok(vm);
        }
    }
}