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
    public class GetCountyByCountryDropdownQuery : IRequest<SelectItemVm>
    {
        public short CountryId { get; set; }
    }

    public class GetCountyByCountryDropdownQueryHandler : IRequestHandler<GetCountyByCountryDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetCountyByCountryDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetCountyByCountryDropdownQuery request,
            CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Counties
                    .Where(x => request.CountryId == x.CountryId && !x.Deleted)
                    .Select(x => new SelectItemDto {Label = x.Name, Value = x.Id.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
