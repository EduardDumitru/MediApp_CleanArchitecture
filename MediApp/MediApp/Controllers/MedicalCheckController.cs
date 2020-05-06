using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class MedicalCheckController : ApiController
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalCheckDetailsVm>> GetMedicalCheck(long id)
        {
            var vm = await Mediator.Send(new GetMedicalCheckDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid medical check was found");
            }

            return Ok(vm);
        }

        [HttpGet("employeemedicalchecks/{employeeId}")]
        [Authorize(Roles = "Admin Doctor Nurse")]
        public async Task<ActionResult<EmployeeMedicalChecksListVm>> GetEmployeeMedicalCheck(long employeeId)
        {
            var vm = await Mediator.Send(new GetEmployeeMedicalChecksListQuery() {EmployeeId = employeeId});

            if (vm == null)
            {
                return BadRequest("No valid medical check was found");
            }

            return Ok(vm);
        }

        [HttpGet("patientmedicalchecks/{patientId}")]
        public async Task<ActionResult<MedicalCheckDetailsVm>> GetPatientMedicalCheck(long patientId)
        {
            var vm = await Mediator.Send(new GetPatientMedicalChecksListQuery() {PatientId = patientId});

            if (vm == null)
            {
                return BadRequest("No valid medical check was found");
            }

            return Ok(vm);
        }

        [HttpPost]
        public async Task<IActionResult> AddMedicalCheck([FromBody] AddMedicalCheckCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateMedicalCheck([FromBody] UpdateMedicalCheckCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMedicalCheck([FromBody] DeleteMedicalCheckCommand command)
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
