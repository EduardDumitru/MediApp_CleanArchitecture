using System.Collections.Generic;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class EmployeeController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeeDetailsVm>> GetEmployeeDetails(long id)
        {
            var vm = await Mediator.Send(new GetEmployeeDetailsQuery {Id = id});

            if (vm == null) return BadRequest(Result.Failure(new List<string> {"No valid employee was found"}));

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeesListVm>> GetEmployees()
        {
            var vm = await Mediator.Send(new GetEmployeesListQuery());

            return Ok(vm);
        }

        [HttpPost("employeesdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetEmployeesDropdown(
            [FromBody] GetEmployeeDropdownQuery employeeDropdownQuery)
        {
            var vm = await Mediator.Send(employeeDropdownQuery);

            return Ok(vm);
        }

        [HttpGet("employeesdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetEmployeesDropdown()
        {
            var vm = await Mediator.Send(new GetAllEmployeesDropdownQuery());

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> AddEmployee([FromBody] AddEmployeeCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> UpdateEmployee([FromBody] UpdateEmployeeCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{employeeId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> DeleteEmployee(long employeeId)
        {
            var result = await Mediator.Send(new DeleteEmployeeCommand {Id = employeeId});

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> RestoreEmployee([FromBody] RestoreEmployeeCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }
    }
}