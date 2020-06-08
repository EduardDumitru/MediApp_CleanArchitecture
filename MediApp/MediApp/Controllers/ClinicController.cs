using System.Collections.Generic;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class ClinicController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ClinicDetailsVm>> GetClinicDetails(int id)
        {
            var vm = await Mediator.Send(new GetClinicDetailsQuery {Id = id});

            if (vm == null) return BadRequest(Result.Failure(new List<string> {"No valid clinic was found"}));

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ClinicsListVm>> GetClinics()
        {
            var vm = await Mediator.Send(new GetClinicsListQuery());

            return Ok(vm);
        }

        [HttpGet("clinicsdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetClinicsDropdown(short? countryId = null, int? countyId = null,
            int? cityId = null)
        {
            var vm = await Mediator.Send(new GetClinicDropdownQuery
                {CountryId = countryId, CountyId = countyId, CityId = cityId});

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> AddClinic([FromBody] AddClinicCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> UpdateClinic([FromBody] UpdateClinicCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{clinicId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> DeleteClinic(int clinicId)
        {
            var result = await Mediator.Send(new DeleteClinicCommand {Id = clinicId});

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> RestoreClinic([FromBody] RestoreClinicCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }
    }
}