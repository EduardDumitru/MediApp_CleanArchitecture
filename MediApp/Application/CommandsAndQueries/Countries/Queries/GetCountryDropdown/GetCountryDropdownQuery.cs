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
    public class GetCountryDropdownQuery : IRequest<SelectItemVm>
    {
    }

    public class GetCountryDropdownQueryHandler : IRequestHandler<GetCountryDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetCountryDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetCountryDropdownQuery request, CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Countries
                    .Where(x => !x.Deleted)
                    .Select(x => new SelectItemDto {Label = x.Name, Value = x.Id.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
