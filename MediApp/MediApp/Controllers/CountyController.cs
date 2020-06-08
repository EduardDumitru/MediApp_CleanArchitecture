using System.Collections.Generic;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    public class CountyController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CountyDetailsVm>> GetCountyDetails(int id)
        {
            var vm = await Mediator.Send(new GetCountyDetailsQuery {Id = id});

            if (vm == null) return BadRequest(Result.Failure(new List<string> {"No valid county was found"}));

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CountiesListVm>> GetCounties()
        {
            var vm = await Mediator.Send(new GetCountiesListQuery());

            return Ok(vm);
        }

        [HttpGet("countiesdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetCountiesDropdown()
        {
            var vm = await Mediator.Send(new GetCountyDropdownQuery());

            return Ok(vm);
        }

        [HttpGet("countiesdropdown/{countryId}")]
        public async Task<ActionResult<SelectItemVm>> GetCountiesByCountryDropdown(short countryId)
        {
            var vm = await Mediator.Send(new GetCountyByCountryDropdownQuery {CountryId = countryId});

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> AddCounty([FromBody] AddCountyCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> UpdateCounty([FromBody] UpdateCountyCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{countyId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> DeleteCounty(int countyId)
        {
            var result = await Mediator.Send(new DeleteCountyCommand {Id = countyId});

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> RestoreCounty([FromBody] RestoreCountyCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }
    }
}