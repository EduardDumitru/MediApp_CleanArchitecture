using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetUserProfilesDropdownQuery : IRequest<SelectItemVm>
    {
    }

    public class GetUserProfilesDropdownQueryHandler : IRequestHandler<GetUserProfilesDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetUserProfilesDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetUserProfilesDropdownQuery request,
            CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.UserProfiles
                    .Where(x => !x.Deleted)
                    .Select(x => new SelectItemDto {Label = x.GetFullName(), Value = x.Id.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}