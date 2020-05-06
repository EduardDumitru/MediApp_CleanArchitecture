using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.CommandsAndQueries.Genders.Commands.RestoreGender;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class GenderController: ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GenderDetailsVm>> GetGenderDetails(short id)
        {
            var vm = await Mediator.Send(new GetGenderDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid gender was found");
            }

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GendersListVm>> GetGenders()
        {
            var vm = await Mediator.Send(new GetGendersListQuery());

            return Ok(vm);
        }

        [HttpGet("gendersdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetGendersDropdown()
        {
            var vm = await Mediator.Send(new GetGenderDropdownQuery());

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddGender([FromBody] AddGenderCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateGender([FromBody] UpdateGenderCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteGender([FromBody] DeleteGenderCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RestoreGender([FromBody] RestoreGenderCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}