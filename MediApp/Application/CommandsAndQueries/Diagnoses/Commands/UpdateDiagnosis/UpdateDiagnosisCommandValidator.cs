using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Application.Common.Interfaces;
using FluentValidation;

namespace Application.CommandsAndQueries
{
    public class UpdateDiagnosisCommandValidator : AbstractValidator<UpdateDiagnosisCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDiagnosisCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .Must(BeUniqueDiagnosis).WithMessage("Name already exists");
        }

        private bool BeUniqueDiagnosis(UpdateDiagnosisCommand updateDiagnosisCommand, string name)
        {
            return _context.Diagnoses
                .Where(x => x.Id != updateDiagnosisCommand.Id)
                .All(x => x.Name != name);
        }
    }
}
