using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class EmployeeTypeController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeeTypeDetailsVm>> GetEmployeeTypeDetails(short id)
        {
            var vm = await Mediator.Send(new GetEmployeeTypeDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid Employee Type was found");
            }

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeeTypesListVm>> GetEmployeeTypes()
        {
            var vm = await Mediator.Send(new GetEmployeeTypesListQuery());

            return Ok(vm);
        }

        [HttpGet("employeetypesdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetEmployeeTypesDropdown()
        {
            var vm = await Mediator.Send(new GetEmployeeTypeDropdownQuery());

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddEmployeeType([FromBody] AddEmployeeTypeCommand command)
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
        public async Task<IActionResult> UpdateEmployeeType([FromBody] UpdateEmployeeTypeCommand command)
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
        public async Task<IActionResult> DeleteEmployeeType([FromBody] DeleteEmployeeTypeCommand command)
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
        public async Task<IActionResult> RestoreEmployeeType([FromBody] RestoreEmployeeTypeCommand command)
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