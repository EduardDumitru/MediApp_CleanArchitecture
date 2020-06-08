using System.Collections.Generic;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class DrugController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DrugDetailsVm>> GetDrugDetails(int id)
        {
            var vm = await Mediator.Send(new GetDrugDetailsQuery {Id = id});

            if (vm == null) return BadRequest(Result.Failure(new List<string> {"No valid drug was found"}));

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DrugsListVm>> GetDrugs()
        {
            var vm = await Mediator.Send(new GetDrugsListQuery());

            return Ok(vm);
        }

        [HttpGet("drugsdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetDrugsDropdown()
        {
            var vm = await Mediator.Send(new GetDrugDropdownQuery());

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> AddDrug([FromBody] AddDrugCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> UpdateDrug([FromBody] UpdateDrugCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{drugId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> DeleteDrug(int drugId)
        {
            var result = await Mediator.Send(new DeleteDrugCommand {Id = drugId});

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> RestoreDrug([FromBody] RestoreDrugCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }
    }
}