﻿using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetCountyByCountryDropdownQueryValidator : AbstractValidator<GetCountyByCountryDropdownQuery>
    {
        private readonly IApplicationDbContext _context;

        public GetCountyByCountryDropdownQueryValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.CountryId)
                .NotEmpty().WithMessage("Id is required")
                .MustAsync(ExistsCountry).WithMessage("County is not valid");
        }

        private async Task<bool> ExistsCountry(short countryId, CancellationToken cancellationToken)
        {
            return await _context.Countries
                .AnyAsync(x => x.Id == countryId && !x.Deleted, cancellationToken);
        }
    }
}