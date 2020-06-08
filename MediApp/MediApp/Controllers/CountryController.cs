using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MediApp.Controllers
{
    public class CountryController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CountryDetailsVm>> GetCountryDetails(short id)
        {
            var vm = await Mediator.Send(new GetCountryDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest(Result.Failure(new List<string> {"No valid country was found"}));
            }

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CountriesListVm>> GetCountries()
        {
            var vm = await Mediator.Send(new GetCountriesListQuery());

            return Ok(vm);
        }

        [HttpGet("countriesdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetCountriesDropdown()
        {
            var vm = await Mediator.Send(new GetCountryDropdownQuery());

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> AddCountry([FromBody] AddCountryCommand command)
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
        public async Task<ActionResult<Result>> UpdateCountry([FromBody] UpdateCountryCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{countryId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> DeleteCountry(short countryId)
        {
            var result = await Mediator.Send(new DeleteCountryCommand {Id = countryId});

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Result>> RestoreCountry([FromBody] RestoreCountryCommand command)
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
