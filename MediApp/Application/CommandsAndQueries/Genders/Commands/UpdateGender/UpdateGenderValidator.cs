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
    public class UpdateGenderValidator : AbstractValidator<UpdateGenderCommand>
    {
        private readonly IApplicationDbContext _context;
        public UpdateGenderValidator(IApplicationDbContext context)
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
