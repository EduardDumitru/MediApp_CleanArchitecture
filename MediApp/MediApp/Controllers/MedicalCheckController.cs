using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
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
                return BadRequest(Result.Failure(new List<string> {"No valid medical check was found"}));
            }

            return Ok(vm);
        }

        [HttpGet("employeemedicalchecks/{employeeId}")]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<EmployeeMedicalChecksListVm>> GetEmployeeMedicalCheck(long employeeId)
        {
            var vm = await Mediator.Send(new GetEmployeeMedicalChecksListQuery() {EmployeeId = employeeId});

            if (vm == null)
            {
                return BadRequest(Result.Failure(new List<string> {"No valid medical check was found"}));
            }

            return Ok(vm);
        }

        [HttpGet("patientmedicalchecks/{patientId}")]
        public async Task<ActionResult<PatientMedicalChecksListVm>> GetPatientMedicalCheck(long patientId)
        {
            var vm = await Mediator.Send(new GetPatientMedicalChecksListQuery() {PatientId = patientId});

            if (vm == null)
            {
                return BadRequest(Result.Failure(new List<string> {"No valid medical check was found"}));
            }

            return Ok(vm);
        }

        [HttpPost("toadd")]
        public async Task<ActionResult<MedicalChecksToAddListVm>> GetMedicalChecksToAdd(
            [FromBody] GetMedicalChecksToAddListQuery medicalChecksToAddListQuery)
        {
            var vm = await Mediator.Send(medicalChecksToAddListQuery);

            if (vm == null)
            {
                return BadRequest(Result.Failure(new List<string> {"No valid medical check was found"}));
            }

            return Ok(vm);
        }

        [HttpPost]
        public async Task<ActionResult<Result>> AddMedicalCheck([FromBody] AddMedicalCheckCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<Result>> UpdateMedicalCheck([FromBody] UpdateMedicalCheckCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{medicalCheckId}")]
        public async Task<ActionResult<Result>> DeleteMedicalCheck(long medicalCheckId)
        {
            var result = await Mediator.Send(new DeleteMedicalCheckCommand {Id = medicalCheckId});

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
