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
    public class GetCityByCountyDropdownQuery : IRequest<SelectItemVm>
    {
        public int CountyId { get; set; }
    }

    public class GetCityByCountyDropdownQueryHandler : IRequestHandler<GetCityByCountyDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetCityByCountyDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetCityByCountyDropdownQuery request, CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Cities
                    .Where(x => request.CountyId == x.CountyId && !x.Deleted)
                    .Select(x => new SelectItemDto {Label = x.Name, Value = x.Id.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
