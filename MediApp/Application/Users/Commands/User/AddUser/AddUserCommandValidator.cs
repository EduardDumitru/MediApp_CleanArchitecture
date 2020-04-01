using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace Application.Users.Commands.User.AddUser
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
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("The specified email is not valid.")
                .MustAsync(BeUniqueEmail).WithMessage("The specified email already exists.");

            RuleFor(x => x.CNP)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("CNP is required.")
                .Length(13).WithMessage("CNP must have 13 digits")
                .Matches("^[0-9]*$")
                .MustAsync(BeUniqueCNP).WithMessage("The specified CNP already exists")
                .MustAsync(IsCNPValid).WithMessage("The specified CNP is not valid");

            RuleFor(x => x.PhoneNumber)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Phone number is required.")
                .Length(10).WithMessage("Phone number must have 10 digits")
                .Matches("^07[0-9]*$").WithMessage("Phone number is not valid")
                .MustAsync(BeUniquePhoneNumber).WithMessage("Phone number already exists");

            RuleFor(x => x.FirstName)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("First Name is required");

            RuleFor(x => x.LastName)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Last Name is required");

            RuleFor(x => x.StreetNo)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Street Number is required");

            RuleFor(x => x.CountryId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Country is required");

            RuleFor(x => x.CountyId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("County is required");

            RuleFor(x => x.CityId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("City is required")
                .Must(IsCityMappedCorrectly).WithMessage("Country, County and City are not valid");

            RuleFor(x => x.GenderId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Gender is required")
                .MustAsync(IsGenderValid).WithMessage("Gender is not valid");

            RuleFor(x => x.Password)
                .Cascade(CascadeMode.StopOnFirstFailure)
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
            string gender = cnp.Substring(0, 1);
            string year = cnp.Substring(1, 2);
            string month = cnp.Substring(3, 2);
            string day = cnp.Substring(5, 2);
            string county = cnp.Substring(7, 2);

            short yearNr = default;

            if (!short.TryParse(year, out short yearResult))
            {
                return false;
            }

            if (!short.TryParse(county, out short countyResult))
            {
                return false;
            }

            if (byte.TryParse(gender, out byte genderResult))
            {
                if (genderResult <= 0 || genderResult > 9 || genderResult == 3 || genderResult == 4)
                {
                    return false;
                }
            }
            else
            {
                return false;
            }

            if (genderResult == 1 || genderResult == 2)
            {
                yearNr = (short) (1900 + yearResult);
            }

            if (genderResult == 5 || genderResult == 6)
            {
                yearNr = (short) (2000 + yearResult);
            }

            if (genderResult == 7 || genderResult == 8 || genderResult == 9)
            {
                yearNr = (short)(2000 + yearResult);
                if (_dateTime.Now.Year < yearNr)
                {
                    yearNr -= 100;
                }
            }

            string date = $"{day}-{month}-{yearNr}";

            if (!DateTime.TryParseExact(date, "dd-MM-yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out var result))
            {
                return false;
            }

            var today = _dateTime.Now.Date;
            var age = today.Year - result.Date.Year;

            if (result.Date > today.Date.AddYears(-age))
            {
                age--;
            }

            if (age < 14)
            {
                return false;
            }

            if (countyResult < 1 || countyResult > 52)
            {
                return false;
            }

            return await Task.FromResult(true);
        }

        private async Task<bool> BeUniquePhoneNumber(string phoneNumber, CancellationToken cancellationToken)
        {
            return await _context.UserProfiles
                .AllAsync(x => x.PhoneNumber != phoneNumber, cancellationToken);
        }

        private bool IsCityMappedCorrectly(AddUserCommand user, int cityId)
        {
            return _context.Cities
                .Include(x => x.County)
                .ThenInclude(x => x.Country)
                .Where(x => x.Id == cityId 
                            && x.County.Id == user.CountyId 
                            && x.County.Country.Id == user.CountryId)
                .Any();
        }

        private async Task<bool> IsGenderValid(short genderId, CancellationToken cancellationToken)
        {
            return await _context.Genders.AnyAsync(x => x.Id == genderId, cancellationToken);
        }
    }
}
