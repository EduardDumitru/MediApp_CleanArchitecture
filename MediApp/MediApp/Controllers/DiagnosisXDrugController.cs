using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class DiagnosisXDrugController : ApiController
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DiagnosisXDrugsListVm>> GetDiagnosisXDrugs()
        {
            var vm = await Mediator.Send(new GetDiagnosisXDrugsListQuery());

            return Ok(vm);
        }

        [HttpGet("drugsbydiagnosesdropdown/{diagnosisId}")]
        public async Task<ActionResult<SelectItemVm>> GetDrugsByDiagnosisDropdown(int diagnosisId)
        {
            var vm = await Mediator.Send(new GetDrugsByDiagnosisDropdownQuery {DiagnosisId = diagnosisId});

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> AddDiagnosisXDrug([FromBody] AddDiagnosisXDrugCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{diagnosisXDrugId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> DeleteDiagnosisXDrug(long diagnosisXDrugId)
        {
            var result = await Mediator.Send(new DeleteDiagnosisXDrugCommand {Id = diagnosisXDrugId});

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> RestoreDiagnosisXDrug([FromBody] RestoreDiagnosisXDrugCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }
    }
}