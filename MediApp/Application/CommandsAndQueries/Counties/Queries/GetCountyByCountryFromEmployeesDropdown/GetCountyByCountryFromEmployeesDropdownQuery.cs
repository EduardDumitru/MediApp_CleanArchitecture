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
    public class GetCountyByCountryFromEmployeesDropdownQuery : IRequest<SelectItemVm>
    {
        public short CountryId { get; set; }
    }

    public class GetCountyByCountryFromEmployeesDropdownQueryHandler : IRequestHandler<GetCountyByCountryFromEmployeesDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetCountyByCountryFromEmployeesDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetCountyByCountryFromEmployeesDropdownQuery request,
            CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Employees
                    .Include(x => x.Clinic).ThenInclude(x => x.County)
                    .Where(x => request.CountryId == x.Clinic.CountryId && !x.Clinic.Deleted && !x.Clinic.County.Deleted 
                                && !x.Deleted && x.MedicalCheckTypeId.HasValue)
                    .Select(x => new SelectItemDto {Label = x.Clinic.County.Name, Value = x.Clinic.County.Id.ToString()})
                    .Distinct()
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
