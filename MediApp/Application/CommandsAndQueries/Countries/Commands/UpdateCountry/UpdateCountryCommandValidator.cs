using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateCountryCommandValidator : AbstractValidator<UpdateCountryCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCountryCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueCountry).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueCountry(string name, CancellationToken cancellationToken)
        {
            return await _context.Countries
                .AnyAsync(x => x.Name != name, cancellationToken);
        }
    }
}
