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
    public class GetCountryFromEmployeesDropdownQuery : IRequest<SelectItemVm>
    {
    }

    public class GetCountryFromEmployeesDropdownQueryHandler : IRequestHandler<GetCountryFromEmployeesDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetCountryFromEmployeesDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetCountryFromEmployeesDropdownQuery request, CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Employees
                    .Include(x => x.Clinic).ThenInclude(x => x.Country)
                    .Where(x => !x.Deleted && !x.Clinic.Deleted && !x.Clinic.Country.Deleted && x.MedicalCheckTypeId.HasValue)
                    .Select(x => new SelectItemDto {Label = x.Clinic.Country.Name, Value = x.Clinic.Country.Id.ToString()})
                    .Distinct()
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
