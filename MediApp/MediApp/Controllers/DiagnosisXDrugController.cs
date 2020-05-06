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
            var vm = await Mediator.Send(new GetDrugsByDiagnosisDropdownQuery() {DiagnosisId = diagnosisId});

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddDiagnosisXDrug([FromBody] AddDiagnosisXDrugCommand command)
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
        public async Task<IActionResult> DeleteDiagnosisXDrug([FromBody] DeleteDiagnosisXDrugCommand command)
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
        public async Task<IActionResult> RestoreDiagnosisXDrug([FromBody] RestoreDiagnosisXDrugCommand command)
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