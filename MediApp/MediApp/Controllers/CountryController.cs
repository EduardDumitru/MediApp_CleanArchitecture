using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class CountryController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CountryDetailsVm>> GetCountryDetails(short id)
        {
            var vm = await Mediator.Send(new GetCountryDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid country was found");
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
        public async Task<IActionResult> AddCountry([FromBody] AddCountryCommand command)
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
        public async Task<IActionResult> UpdateCountry([FromBody] UpdateCountryCommand command)
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
        public async Task<IActionResult> DeleteCountry([FromBody] DeleteCountryCommand command)
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
        public async Task<IActionResult> RestoreCountry([FromBody] RestoreCountryCommand command)
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
