using System.Collections.Generic;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class HolidayIntervalController : ApiController
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<HolidayIntervalDetailsVm>> GetHolidayIntervalDetails(long id)
        {
            var vm = await Mediator.Send(new GetHolidayIntervalDetailsQuery {Id = id});

            if (vm == null) return BadRequest(Result.Failure(new List<string> {"No valid holiday interval was found"}));

            return Ok(vm);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<HolidayIntervalsListVm>> GetHolidayIntervals()
        {
            var vm = await Mediator.Send(new GetHolidayIntervalsListQuery());

            return Ok(vm);
        }

        [HttpGet("byclinic/{clinicId}")]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<HolidayIntervalsListVm>> GetHolidayIntervals(int clinicId)
        {
            var vm = await Mediator.Send(new GetHolidayIntervalsByClinicListQuery {ClinicId = clinicId});

            return Ok(vm);
        }

        [HttpPost]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<Result>> AddHolidayInterval([FromBody] AddHolidayIntervalCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<Result>> UpdateHolidayInterval([FromBody] UpdateHolidayIntervalCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{holidayIntervalId}")]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<Result>> DeleteHolidayInterval(long holidayIntervalId)
        {
            var result = await Mediator.Send(new DeleteHolidayIntervalCommand {Id = holidayIntervalId});

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("restore")]
        [Authorize(Roles = "Admin, Doctor, Nurse")]
        public async Task<ActionResult<Result>> RestoreHolidayInterval([FromBody] RestoreHolidayIntervalCommand command)
        {
            var result = await Mediator.Send(command);

            if (!result.Succeeded) return BadRequest(result);

            return Ok(result);
        }
    }
}