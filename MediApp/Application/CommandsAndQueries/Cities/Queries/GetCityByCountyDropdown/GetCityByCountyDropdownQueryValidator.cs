using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetCityByCountyDropdownQueryValidator : AbstractValidator<GetCityByCountyDropdownQuery>
    {
        private readonly IApplicationDbContext _context;

        public GetCityByCountyDropdownQueryValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.CountyId)
                .NotEmpty().WithMessage("Id is required")
                .MustAsync(ExistsCounty).WithMessage("County is not valid");
        }

        private async Task<bool> ExistsCounty(int countyId, CancellationToken cancellationToken)
        {
            return await _context.Counties
                .AnyAsync(x => x.Id == countyId && !x.Deleted, cancellationToken);
        }
    }
}