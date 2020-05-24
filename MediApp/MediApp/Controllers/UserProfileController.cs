using System.Collections.Generic;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class UserProfileController : ApiController
    {
        // GET
        [HttpPut]
        public async Task<ActionResult<Result>> UpdateUserProfile([FromBody] UpdateUserProfileCommand command)
        {

            var response = await Mediator.Send(command);

            if (!response.Succeeded)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<UserProfileListVm>> GetUserProfiles()
        {
            var vm = await Mediator.Send(new GetUserProfilesListQuery());

            return Ok(vm);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileDetailVm>> GetUserProfile(long id)
        {
            var vm = await Mediator.Send(new GetUserProfileDetailQuery() {Id = id});

            if (vm == null)
            {
                return BadRequest(Result.Failure(new List<string> {"No valid user profile was found"}));
            }

            return Ok(vm);
        }

        [HttpGet("usersdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetUserProfilesDropdown()
        {
            var vm = await Mediator.Send(new GetUserProfilesDropdownQuery());

            return Ok(vm);
        }
    }
}