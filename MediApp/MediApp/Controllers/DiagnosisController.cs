using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.CommandsAndQueries.Diagnoses;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class DiagnosisController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DiagnosisDetailsVm>> GetDiagnosisDetails(int id)
        {
            var vm = await Mediator.Send(new GetDiagnosisDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid diagnosis was found");
            }

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DiagnosesListVm>> GetDiagnoses()
        {
            var vm = await Mediator.Send(new GetDiagnosesListQuery());

            return Ok(vm);
        }

        [HttpGet("diagnosesdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetDiagnosesDropdown()
        {
            var vm = await Mediator.Send(new GetDiagnosisDropdownQuery());

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> AddDiagnosis([FromBody] AddDiagnosisCommand command)
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
        public async Task<ActionResult<Result>> UpdateDiagnosis([FromBody] UpdateDiagnosisCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{diagnosisId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> DeleteDiagnosis(int diagnosisId)
        {
            var result = await Mediator.Send(new DeleteDiagnosisCommand {Id = diagnosisId});

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> RestoreDiagnosis([FromBody] RestoreDiagnosisCommand command)
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