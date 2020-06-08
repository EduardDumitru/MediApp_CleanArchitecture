using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetClinicDropdownQuery : IRequest<SelectItemVm>
    {
        public short? CountryId { get; set; }
        public int? CountyId { get; set; }
        public int? CityId { get; set; }
    }

    public class GetClinicDropdownQueryHandler : IRequestHandler<GetClinicDropdownQuery, SelectItemVm>
    {
        private readonly IApplicationDbContext _context;

        public GetClinicDropdownQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SelectItemVm> Handle(GetClinicDropdownQuery request, CancellationToken cancellationToken)
        {
            var vm = new SelectItemVm
            {
                SelectItems = await _context.Clinics
                    .Where(x => (!request.CountryId.HasValue || request.CountryId.Value == x.CountryId)
                                && (!request.CountyId.HasValue || request.CountyId.Value == x.CountyId)
                                && (!request.CityId.HasValue || request.CityId.Value == x.CityId)
                                && !x.Deleted)
                    .Select(x => new SelectItemDto {Label = x.Name, Value = x.Id.ToString()})
                    .ToListAsync(cancellationToken)
            };

            return vm;
        }
    }
}