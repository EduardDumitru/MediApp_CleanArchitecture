using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddCountryCommandValidator : AbstractValidator<AddCountryCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddCountryCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueCountry).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueCountry(string name, CancellationToken cancellationToken)
        {
            return await _context.Countries
                .AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}