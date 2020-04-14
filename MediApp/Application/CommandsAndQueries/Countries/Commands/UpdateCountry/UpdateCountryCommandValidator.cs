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
    public class UpdateCountryCommandValidator : AbstractValidator<UpdateCountryCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCountryCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .Must(BeUniqueCountry).WithMessage("Name already exists");
        }

        private bool BeUniqueCountry(UpdateCountryCommand updateCountryCommand, string name)
        {
            return _context.Countries
                .Where(x => x.Id != updateCountryCommand.Id)
                .All(x => x.Name != name);
        }
    }
}
