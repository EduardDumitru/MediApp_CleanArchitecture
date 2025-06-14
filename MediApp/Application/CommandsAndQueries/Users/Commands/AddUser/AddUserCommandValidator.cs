﻿using System;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddUserCommandValidator : AbstractValidator<AddUserCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IDateTime _dateTime;

        public AddUserCommandValidator(IApplicationDbContext context, IDateTime dateTime)
        {
            _context = context;
            _dateTime = dateTime;

            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("The specified email is not valid.")
                .MustAsync(BeUniqueEmail).WithMessage("The specified email already exists.");

            RuleFor(x => x.Cnp)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("CNP is required.")
                .Length(13).WithMessage("CNP must have 13 digits")
                .Matches("^[0-9]*$").WithMessage("CNP must have only digits")
                .MustAsync(IsCNPValid).WithMessage("The specified CNP is not valid")
                .MustAsync(BeUniqueCNP).WithMessage("The specified CNP already exists");

            RuleFor(x => x.PhoneNumber)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Phone number is required.")
                .Length(10).WithMessage("Phone number must have 10 digits")
                .Matches("^(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?([0-9]{3}(\\s|\\.|\\-|)){2}$")
                .WithMessage("Phone number is not valid")
                .MustAsync(BeUniquePhoneNumber).WithMessage("Phone number already exists");

            RuleFor(x => x.FirstName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("First Name is required");

            RuleFor(x => x.LastName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Last Name is required");

            RuleFor(x => x.StreetNo)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Street Number is required");

            RuleFor(x => x.CountryId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Country is required");

            RuleFor(x => x.CountyId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("County is required");

            RuleFor(x => x.CityId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("City is required")
                .MustAsync(IsCityMappedCorrectly).WithMessage("Country, County and City are not valid");

            RuleFor(x => x.GenderId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Gender is required")
                .MustAsync(IsGenderValid).WithMessage("Gender is not valid");

            RuleFor(x => x.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Password is required");
        }

        private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
        {
            return await _context.UserProfiles
                .AllAsync(x => x.EmailAddress != email, cancellationToken);
        }

        private async Task<bool> BeUniqueCNP(string cnp, CancellationToken cancellationToken)
        {
            return await _context.UserProfiles
                .AllAsync(x => x.CNP != cnp, cancellationToken);
        }

        private async Task<bool> IsCNPValid(string cnp, CancellationToken cancellationToken)
        {
            var gender = cnp.Substring(0, 1);
            var year = cnp.Substring(1, 2);
            var month = cnp.Substring(3, 2);
            var day = cnp.Substring(5, 2);
            var county = cnp.Substring(7, 2);

            short yearNr = default;

            if (!short.TryParse(year, out var yearResult)) return false;

            if (!short.TryParse(county, out var countyResult)) return false;

            if (byte.TryParse(gender, out var genderResult))
            {
                if (genderResult <= 0 || genderResult > 9 || genderResult == 3 || genderResult == 4) return false;
            }
            else
            {
                return false;
            }

            if (genderResult == 1 || genderResult == 2) yearNr = (short) (1900 + yearResult);

            if (genderResult == 5 || genderResult == 6) yearNr = (short) (2000 + yearResult);

            if (genderResult == 7 || genderResult == 8 || genderResult == 9)
            {
                yearNr = (short) (2000 + yearResult);
                if (_dateTime.Now.Year < yearNr) yearNr -= 100;
            }

            var date = $"{day}-{month}-{yearNr}";

            if (!DateTime.TryParseExact(date, "dd-MM-yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out var result))
                return false;

            var today = _dateTime.Now.Date;
            var age = today.Year - result.Date.Year;

            if (result.Date > today.Date.AddYears(-age)) age--;

            if (age < 14) return false;

            if (countyResult < 1 || countyResult > 52) return false;

            return await Task.FromResult(true);
        }

        private async Task<bool> BeUniquePhoneNumber(string phoneNumber, CancellationToken cancellationToken)
        {
            return await _context.UserProfiles
                .AllAsync(x => x.PhoneNumber != phoneNumber, cancellationToken);
        }

        private async Task<bool> IsCityMappedCorrectly(AddUserCommand user, int cityId,
            CancellationToken cancellationToken)
        {
            return await _context.Cities
                .Include(x => x.County)
                .ThenInclude(x => x.Country)
                .AnyAsync(x => x.Id == cityId
                               && x.County.Id == user.CountyId
                               && x.County.Country.Id == user.CountryId
                               && !x.Deleted, cancellationToken);
        }

        private async Task<bool> IsGenderValid(short genderId, CancellationToken cancellationToken)
        {
            return await _context.Genders.AnyAsync(x => x.Id == genderId && !x.Deleted, cancellationToken);
        }
    }
}