using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class PrescriptionXDrugController : ApiController
    {
        [HttpGet("drugsbyprescription/{prescriptionId}")]
        public async Task<ActionResult<PrescriptionXDrugsListVm>> GetPrescriptionXDrugs(long prescriptionId)
        {
            var vm = await Mediator.Send(new GetDrugsByPrescriptionListQuery() {PrescriptionId = prescriptionId});

            return Ok(vm);
        }


        [HttpPost]
        [Authorize(Roles = "Admin, Doctor")]
        public async Task<ActionResult<Result>> AddPrescriptionXDrug([FromBody] AddPrescriptionXDrugCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{prescriptionXDrugId}")]
        [Authorize(Roles = "Admin, Doctor")]
        public async Task<ActionResult<Result>> DeletePrescriptionXDrug(long prescriptionXDrugId)
        {
            var result = await Mediator.Send(new DeletePrescriptionXDrugCommand {Id = prescriptionXDrugId});

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin, Doctor")]
        public async Task<ActionResult<Result>> UpdatePrescriptionXDrug([FromBody] UpdatePrescriptionXDrugCommand command)
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