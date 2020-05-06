using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Application.Common.Models.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class PrescriptionController : ApiController
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionDetailsVm>> GetPrescription(long id)
        {
            var vm = await Mediator.Send(new GetPrescriptionDetailsQuery() {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid prescription was found");
            }

            return Ok(vm);
        }

        [HttpGet("employeeprescriptions/{employeeId}")]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<EmployeePrescriptionsListVm>> GetEmployeePrescriptions(long employeeId)
        {
            var vm = await Mediator.Send(new GetEmployeePrescriptionsListQuery() {EmployeeId = employeeId});

            return Ok(vm);
        }

        [HttpGet("patientprescriptions/{patientId}")]
        public async Task<ActionResult<PatientPrescriptionsListVm>> GetPatientPrescriptions(long patientId)
        {
            var vm = await Mediator.Send(new GetPatientPrescriptionsListQuery() {PatientId = patientId});

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<IActionResult> AddPrescription([FromBody] AddPrescriptionCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<IActionResult> DeletePrescription([FromBody] DeletePrescriptionCommand command)
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
        public async Task<IActionResult> UpdatePrescription([FromBody] UpdatePrescriptionCommand command)
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