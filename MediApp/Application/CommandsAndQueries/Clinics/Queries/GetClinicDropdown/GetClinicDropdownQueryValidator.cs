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
                .WithMessage("County is not valid")
                .Must(ExistsCountyInCountry)
                .WithMessage("County is not in the selected country")
                .When(x => x.CountyId.HasValue);
            RuleFor(x => x.CityId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .MustAsync(ExistsCity)
                .WithMessage("City is not valid")
                .Must(ExistsCityInCounty)
                .WithMessage("City is not in the selected county")
                .When(x => x.CityId.HasValue);


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

        private bool ExistsCountyInCountry(GetClinicDropdownQuery clinicQuery, int? countyId)
        {
            return _context.Counties
                .Any(x => x.Id == countyId 
                          && x.CountryId == clinicQuery.CountryId 
                          && !x.Deleted);
        }

        private async Task<bool> ExistsCity(int? cityId, CancellationToken cancellationToken)
        {
            return await _context.Cities
                .AnyAsync(x => x.Id == cityId 
                               && !x.Deleted, cancellationToken);
        }

        private bool ExistsCityInCounty(GetClinicDropdownQuery clinicQuery, int? cityId)
        {
            return _context.Cities
                .Any(x => x.Id == cityId
                          && x.CountyId == clinicQuery.CountyId
                          && !x.Deleted);
        }
    }
}
