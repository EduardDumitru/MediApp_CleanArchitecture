using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetClinicDropdownQueryValidator : AbstractValidator<GetClinicDropdownQuery>
    {
        private readonly IApplicationDbContext _context;

        public GetClinicDropdownQueryValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.CountryId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .MustAsync(ExistsCountry)
                .When(x => x.CountryId.HasValue)
                .WithMessage("Country is not valid");
            RuleFor(x => x.CountyId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .MustAsync(ExistsCounty)
                .When(x => x.CountyId.HasValue)
                .WithMessage("County is not valid")
                .MustAsync(ExistsCountyInCountry)
                .When(x => x.CountyId.HasValue)
                .WithMessage("County is not in the selected country");
            RuleFor(x => x.CityId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .MustAsync(ExistsCity)
                .WithMessage("City is not valid")
                .When(x => x.CityId.HasValue)
                .MustAsync(ExistsCityInCounty)
                .When(x => x.CityId.HasValue)
                .WithMessage("City is not in the selected county");
        }

        private async Task<bool> ExistsCountry(short? countryId, CancellationToken cancellationToken)
        {
            return await _context.Countries
                .AnyAsync(x => x.Id == countryId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsCounty(int? countyId, CancellationToken cancellationToken)
        {
            return await _context.Counties
                .AnyAsync(x => x.Id == countyId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsCountyInCountry(GetClinicDropdownQuery clinicQuery, int? countyId, CancellationToken cancellationToken)
        {
            return await _context.Counties
                .AnyAsync(x => x.Id == countyId 
                          && x.CountryId == clinicQuery.CountryId 
                          && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsCity(int? cityId, CancellationToken cancellationToken)
        {
            return await _context.Cities
                .AnyAsync(x => x.Id == cityId 
                               && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsCityInCounty(GetClinicDropdownQuery clinicQuery, int? cityId, CancellationToken cancellationToken)
        {
            return await _context.Cities
                .AnyAsync(x => x.Id == cityId
                          && x.CountyId == clinicQuery.CountyId
                          && !x.Deleted, cancellationToken);
        }
    }
}
