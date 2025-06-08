using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateCountyCommandValidator : AbstractValidator<UpdateCountyCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCountyCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.CountryId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Country is required")
                .MustAsync(ExistsCountry).WithMessage("Country is not valid");
        }

        private async Task<bool> ExistsCountry(short countryId, CancellationToken cancellationToken)
        {
            return await _context.Countries
                .AnyAsync(x => x.Id == countryId && !x.Deleted, cancellationToken);
        }
    }
}