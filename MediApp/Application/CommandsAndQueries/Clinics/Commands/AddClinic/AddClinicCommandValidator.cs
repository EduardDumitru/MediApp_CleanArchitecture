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
    public class AddClinicCommandValidator : AbstractValidator<AddClinicCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddClinicCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.Email)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("The specified email is not valid.");
            RuleFor(x => x.PhoneNumber)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Phone number is required.")
                .Length(10).WithMessage("Phone number must have 10 digits")
                .Matches("^07[0-9]*$").WithMessage("Phone number is not valid");
            RuleFor(x => x.StreetNo)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Street Number is required");
            RuleFor(x => x.CountryId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .MustAsync(ExistsCountry)
                .WithMessage("Country is not valid");
            RuleFor(x => x.CountyId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .MustAsync(ExistsCounty)
                .WithMessage("County is not valid")
                .Must(ExistsCountyInCountry)
                .WithMessage("County is not in the selected country");
            RuleFor(x => x.CityId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .MustAsync(ExistsCity)
                .WithMessage("City is not valid")
                .Must(ExistsCityInCounty)
                .WithMessage("City is not in the selected county");
        }

        private async Task<bool> ExistsCountry(short countryId, CancellationToken cancellationToken)
        {
            return await _context.Countries
                .AnyAsync(x => x.Id == countryId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsCounty(int countyId, CancellationToken cancellationToken)
        {
            return await _context.Counties
                .AnyAsync(x => x.Id == countyId && !x.Deleted, cancellationToken);
        }

        private bool ExistsCountyInCountry(AddClinicCommand clinicCommand, int countyId)
        {
            return _context.Counties
                .Any(x => x.Id == countyId 
                          && x.CountryId == clinicCommand.CountryId 
                          && !x.Deleted);
        }

        private async Task<bool> ExistsCity(int cityId, CancellationToken cancellationToken)
        {
            return await _context.Cities
                .AnyAsync(x => x.Id == cityId 
                               && !x.Deleted, cancellationToken);
        }

        private bool ExistsCityInCounty(AddClinicCommand clinicCommand, int cityId)
        {
            return _context.Cities
                .Any(x => x.Id == cityId
                          && x.CountyId == clinicCommand.CountyId
                          && !x.Deleted);
        }
    }
}
