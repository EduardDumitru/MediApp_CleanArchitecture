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
    public class AddCountyCommandValidator : AbstractValidator<AddCountyCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddCountyCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.CountryId)
                .Cascade(CascadeMode.StopOnFirstFailure)
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
