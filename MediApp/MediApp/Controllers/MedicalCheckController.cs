using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Produces("application/json")]
    public class MedicalCheckController : ApiController
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalCheckDetailsVm>> GetMedicalCheck(long id)
        {
            var vm = await Mediator.Send(new GetMedicalCheckDetailsQuery {Id = id});

            if (vm == null)
            {
                return BadRequest("No valid medical check was found");
            }

            return Ok(vm);
        }
    }
}
