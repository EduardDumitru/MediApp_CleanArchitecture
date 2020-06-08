using System.Threading.Tasks;
using Application.CommandsAndQueries;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediApp.Controllers
{
    [Authorize]
    public class RoleController : ApiController
    {
        [HttpGet("rolesdropdown")]
        public async Task<ActionResult<SelectItemVm>> GetRolesDropdown()
        {
            var vm = await Mediator.Send(new GetRolesDropdownQuery());

            return Ok(vm);
        }
    }
}