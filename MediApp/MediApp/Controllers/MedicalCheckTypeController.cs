using System.Collections.Generic;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class MedicalCheckTypeController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<MedicalCheckTypeDetailsVm>> GetMedicalCheckTypeDetails(short id)
        {
            var vm = await Mediator.Send(new GetMedicalCheckTypeDetailsQuery {Id = id});

            if (vm == null)
                return BadRequest(Result.Failure(new List<string> {"No valid medical check type was found"}));

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<MedicalCheckTypesListVm>> GetMedicalCheckTypes()
        {
            var vm = await Mediator.Send(new GetMedicalCheckTypesListQuery());

            return Ok(vm);
        }

        [HttpGet("medicalchecktypesdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetMedicalCheckTypesDropdown()
        {
            var vm = await Mediator.Send(new GetMedicalCheckTypeDropdownQuery());

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> AddMedicalCheckType([FromBody] AddMedicalCheckTypeCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> UpdateMedicalCheckType([FromBody] UpdateMedicalCheckTypeCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{medicalCheckTypeId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> DeleteMedicalCheckType(short medicalCheckTypeId)
        {
            var result = await Mediator.Send(new DeleteMedicalCheckTypeCommand {Id = medicalCheckTypeId});

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> RestoreMedicalCheckType(
            [FromBody] RestoreMedicalCheckTypeCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }
    }
}