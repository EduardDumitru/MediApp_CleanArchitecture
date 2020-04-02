using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddGenderCommandValidator : AbstractValidator<Gender>
    {
        private readonly IApplicationDbContext _context;
        public AddGenderCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueGender).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueGender(string name, CancellationToken cancellationToken)
        {
            return await _context.Genders
                .AnyAsync(x => x.Name != name, cancellationToken);
        }
    }
}
