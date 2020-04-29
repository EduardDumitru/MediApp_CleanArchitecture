using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Application.Common.Models.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Produces("application/json")]
    public class PrescriptionController : ApiController
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionDetailsVm>> GetPrescription(long id)
        {
            var vm = await Mediator.Send(new GetPrescriptionDetailsQuery() {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid prescription was found");
            }

            return Ok(vm);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPrescription([FromBody] AddPrescriptionCommand command)
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