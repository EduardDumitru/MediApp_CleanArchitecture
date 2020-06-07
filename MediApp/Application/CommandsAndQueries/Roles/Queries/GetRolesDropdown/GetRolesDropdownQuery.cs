using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class GetRolesDropdownQuery : IRequest<SelectItemVm>
    {

    }

    public class GetRolesDropdownQueryHandler : IRequestHandler<GetRolesDropdownQuery, SelectItemVm>
    {
        private readonly IIdentityService _identityService;
        public GetRolesDropdownQueryHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<SelectItemVm> Handle(GetRolesDropdownQuery request,
            CancellationToken cancellationToken)
        {
            return await _identityService.GetRolesDropdown(cancellationToken);
        }
    }
}
