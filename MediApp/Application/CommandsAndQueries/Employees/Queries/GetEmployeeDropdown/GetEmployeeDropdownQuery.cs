using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetEmployeeDropdownQuery : IRequest<SelectItemVm>
    {
        public short MedicalCheckTypeId { get; set; }
        public int ClinicId { get; set; }
    }

    public class GetEmployeeDropdownQueryHandler : IRequestHandler<GetEmployeeDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetEmployeeDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetEmployeeDropdownQuery request,
            CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Employees
                    .Include(x => x.UserProfile)
                    .Where(x => !x.Deleted 
                                && x.MedicalCheckTypeId == request.MedicalCheckTypeId 
                                && x.ClinicId == request.ClinicId)
                    .Select(x => new SelectItemDto {Label = x.UserProfile.GetFullName(), Value = x.Id.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}