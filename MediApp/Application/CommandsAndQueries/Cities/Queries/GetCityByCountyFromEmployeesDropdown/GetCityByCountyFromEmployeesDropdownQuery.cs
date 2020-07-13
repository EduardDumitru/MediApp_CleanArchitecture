﻿using System;
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
    public class GetCityByCountyFromEmployeesDropdownQuery : IRequest<SelectItemVm>
    {
        public int CountyId { get; set; }
    }

    public class GetCityByCountyFromEmployeesDropdownQueryHandler : IRequestHandler<
        GetCityByCountyFromEmployeesDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetCityByCountyFromEmployeesDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetCityByCountyFromEmployeesDropdownQuery request,
            CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Employees
                    .Include(x => x.Clinic).ThenInclude(x => x.City)
                    .Include(x => x.Clinic).ThenInclude(x => x.County)
                    .Where(x => request.CountyId == x.Clinic.County.Id && !x.Clinic.Deleted && !x.Deleted
                                && x.MedicalCheckTypeId.HasValue && !x.Clinic.City.Deleted)
                    .Select(x => new SelectItemDto {Label = x.Clinic.City.Name, Value = x.Clinic.City.Id.ToString()})
                    .Distinct()
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
