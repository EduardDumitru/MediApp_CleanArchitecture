﻿using System.Linq;
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
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("The specified email is not valid.");
            RuleFor(x => x.PhoneNumber)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Phone number is required.")
                .Length(10).WithMessage("Phone number must have 10 digits")
                .Matches("^(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?([0-9]{3}){2}$")
                .WithMessage("Phone number is not valid");
            RuleFor(x => x.StreetNo)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Street Number is required");
            RuleFor(x => x.CountryId)
                .Cascade(CascadeMode.Stop)
                .MustAsync(ExistsCountry)
                .WithMessage("Country is not valid");
            RuleFor(x => x.CountyId)
                .Cascade(CascadeMode.Stop)
                .MustAsync(ExistsCounty)
                .WithMessage("County is not valid")
                .MustAsync(ExistsCountyInCountry)
                .WithMessage("County is not in the selected country");
            RuleFor(x => x.CityId)
                .Cascade(CascadeMode.Stop)
                .MustAsync(ExistsCity)
                .WithMessage("City is not valid")
                .MustAsync(ExistsCityInCounty)
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

        private async Task<bool> ExistsCountyInCountry(AddClinicCommand clinicCommand, int countyId,
            CancellationToken cancellationToken)
        {
            return await _context.Counties
                .AnyAsync(x => x.Id == countyId
                          && x.CountryId == clinicCommand.CountryId
                          && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsCity(int cityId, CancellationToken cancellationToken)
        {
            return await _context.Cities
                .AnyAsync(x => x.Id == cityId
                               && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsCityInCounty(AddClinicCommand clinicCommand, int cityId,
            CancellationToken cancellationToken)
        {
            return await _context.Cities
                .AnyAsync(x => x.Id == cityId
                          && x.CountyId == clinicCommand.CountyId
                          && !x.Deleted, cancellationToken);
        }
    }
}