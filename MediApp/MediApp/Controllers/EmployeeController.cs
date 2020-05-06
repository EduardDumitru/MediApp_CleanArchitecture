using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class EmployeeController: ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeeDetailsVm>> GetEmployeeDetails(int id)
        {
            var vm = await Mediator.Send(new GetEmployeeDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid employee was found");
            }

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeesListVm>> GetEmployees()
        {
            var vm = await Mediator.Send(new GetEmployeesListQuery());

            return Ok(vm);
        }

        [HttpGet("employeesdropdown/{clinicId}/{medicalCheckTypeId}")]
        public async Task<ActionResult<SelectItemVm>> GetEmployeesDropdown(int clinicId, short medicalCheckTypeId)
        {
            var vm = await Mediator.Send(new GetEmployeeDropdownQuery() {ClinicId = clinicId, MedicalCheckTypeId = medicalCheckTypeId});

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddEmployee([FromBody] AddEmployeeCommand command)
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
        public async Task<IActionResult> UpdateEmployee([FromBody] UpdateEmployeeCommand command)
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
        public async Task<IActionResult> DeleteEmployee([FromBody] DeleteEmployeeCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RestoreEmployee([FromBody] RestoreEmployeeCommand command)
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