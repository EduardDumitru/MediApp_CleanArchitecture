using System.Collections.Generic;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    public class CityController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CityDetailsVm>> GetCityDetails(int id)
        {
            var vm = await Mediator.Send(new GetCityDetailsQuery {Id = id});

            if (vm == null) return BadRequest(Result.Failure(new List<string> {"No valid city was found"}));

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CitiesListVm>> GetCities()
        {
            var vm = await Mediator.Send(new GetCitiesListQuery());

            return Ok(vm);
        }

        [HttpGet("citiesdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetCitiesDropdown()
        {
            var vm = await Mediator.Send(new GetCityDropdownQuery());

            return Ok(vm);
        }

        [HttpGet("citiesdropdown/{countyId}")]
        public async Task<ActionResult<SelectItemVm>> GetCitiesByCountyDropdown(int countyId)
        {
            var vm = await Mediator.Send(new GetCityByCountyDropdownQuery {CountyId = countyId});

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> AddCity([FromBody] AddCityCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> UpdateCity([FromBody] UpdateCityCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{cityId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> DeleteCity(int cityId)
        {
            var result = await Mediator.Send(new DeleteCityCommand {Id = cityId});

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> RestoreCity([FromBody] RestoreCityCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }
    }
}