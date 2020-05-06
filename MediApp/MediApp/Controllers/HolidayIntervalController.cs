using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class HolidayIntervalController: ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<HolidayIntervalDetailsVm>> GetHolidayIntervalDetails(short id)
        {
            var vm = await Mediator.Send(new GetHolidayIntervalDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid holiday interval was found");
            }

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<HolidayIntervalsListVm>> GetHolidayIntervals()
        {
            var vm = await Mediator.Send(new GetHolidayIntervalsListQuery());

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<IActionResult> AddHolidayInterval([FromBody] AddHolidayIntervalCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<IActionResult> UpdateHolidayInterval([FromBody] UpdateHolidayIntervalCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<IActionResult> DeleteHolidayInterval([FromBody] DeleteHolidayIntervalCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<IActionResult> RestoreHolidayInterval([FromBody] RestoreHolidayIntervalCommand command)
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