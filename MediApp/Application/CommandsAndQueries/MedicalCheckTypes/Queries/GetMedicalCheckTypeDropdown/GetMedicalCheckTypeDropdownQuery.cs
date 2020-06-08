using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetMedicalCheckTypeDropdownQuery : IRequest<SelectItemVm>
    {
    }

    public class
        GetMedicalCheckTypeDropdownQueryHandler : IRequestHandler<GetMedicalCheckTypeDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetMedicalCheckTypeDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetMedicalCheckTypeDropdownQuery request,
            CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.MedicalCheckTypes
                    .Where(x => !x.Deleted)
                    .Select(x => new SelectItemDto {Label = x.Name, Value = x.Id.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}