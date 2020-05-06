using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class CityController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CityDetailsVm>> GetCityDetails(int id)
        {
            var vm = await Mediator.Send(new GetCityDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid city was found");
            }

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
            var vm = await Mediator.Send(new GetCityByCountyDropdownQuery() {CountyId = countyId});

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddCity([FromBody] AddCityCommand command)
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
        public async Task<IActionResult> UpdateCity([FromBody] UpdateCityCommand command)
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
        public async Task<IActionResult> DeleteCity([FromBody] DeleteCityCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RestoreCity([FromBody] RestoreCityCommand command)
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