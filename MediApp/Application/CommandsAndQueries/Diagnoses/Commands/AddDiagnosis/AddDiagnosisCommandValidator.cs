using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Application.Common.Interfaces;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class AddDiagnosisCommandValidator : AbstractValidator<AddDiagnosisCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddDiagnosisCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .Must(BeUniqueDiagnosis).WithMessage("Name already exists");
        }

        private bool BeUniqueDiagnosis(AddDiagnosisCommand updateDiagnosisCommand, string name)
        {
            return _context.Diagnoses.All(x => x.Name != name);
        }
    }
}
