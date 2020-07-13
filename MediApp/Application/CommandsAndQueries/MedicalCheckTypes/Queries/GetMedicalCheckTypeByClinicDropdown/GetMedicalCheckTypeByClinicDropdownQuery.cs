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
    public class GetMedicalCheckTypeByClinicDropdownQuery : IRequest<SelectItemVm>
    {
        public int ClinicId { get; set; }
    }

    public class GetMedicalCheckTypeByClinicDropdownQueryHandler : IRequestHandler<GetMedicalCheckTypeByClinicDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetMedicalCheckTypeByClinicDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetMedicalCheckTypeByClinicDropdownQuery request,
            CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Employees
                    .Include(x => x.MedicalCheckType)
                    .Where(x => request.ClinicId == x.ClinicId && !x.Deleted && x.MedicalCheckTypeId.HasValue && !x.MedicalCheckType.Deleted)
                    .Select(x => new SelectItemDto {Label = x.MedicalCheckType.Name, Value = x.MedicalCheckTypeId.ToString()})
                    .Distinct()
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}
