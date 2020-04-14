using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetGenderDropdownQuery : IRequest<SelectItemVm>
    {
    }

    public class GetGenderDropdownQueryHandler : IRequestHandler<GetGenderDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetGenderDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetGenderDropdownQuery request, CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Genders
                    .Where(x => !x.Deleted)
                    .Select(x => new SelectItemDto {Label = x.Name, Value = x.Id.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
