using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
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
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .Must(BeUniqueGender).WithMessage("Name already exists");
        }

        private bool BeUniqueGender(UpdateGenderCommand updateGenderCommand, string name)
        {
            return _context.Genders
                .Where(x => x.Id != updateGenderCommand.Id)
                .All(x => x.Name != name);
        }
    }
}
