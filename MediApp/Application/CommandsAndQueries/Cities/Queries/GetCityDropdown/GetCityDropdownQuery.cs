using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetCityDropdownQuery : IRequest<SelectItemVm>
    {
    }

    public class GetCityDropdownQueryHandler : IRequestHandler<GetCityDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetCityDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetCityDropdownQuery request, CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Cities
                    .Where(x => !x.Deleted)
                    .Select(x => new SelectItemDto {Label = x.Name, Value = x.Id.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
