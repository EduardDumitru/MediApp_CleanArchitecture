using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.CommandsAndQueries
{
    public class AddCityCommandValidator : AbstractValidator<AddCityCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddCityCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.CountyId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("County is required")
                .MustAsync(ExistsCounty).WithMessage("County is not valid");
        }

        private async Task<bool> ExistsCounty(int countyId, CancellationToken cancellationToken)
        {
            return await _context.Counties
                .AnyAsync(x => x.Id == countyId && !x.Deleted, cancellationToken);
        }
    }
}