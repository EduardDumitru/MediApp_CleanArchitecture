using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetDrugsByDiagnosisDropdownQuery : IRequest<SelectItemVm>
    {
        public int DiagnosisId { get; set; }
    }

    public class GetDrugsByDiagnosisDropdownQueryHandler : IRequestHandler<GetDrugsByDiagnosisDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetDrugsByDiagnosisDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetDrugsByDiagnosisDropdownQuery request, CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.DiagnosisXDrugs
                    .Where(x => x.DiagnosisId == request.DiagnosisId && !x.Deleted)
                    .Include(x => x.Drug)
                    .OrderBy(x => x.Drug.Name)
                    .Select(x => new SelectItemDto {Label = x.Drug.Name, Value = x.DrugId.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}