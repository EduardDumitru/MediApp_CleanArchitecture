using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetMedicalChecksByClinicQueryValidator : AbstractValidator<GetMedicalChecksByClinicQuery>
    {
        private readonly IApplicationDbContext _context;

        public GetMedicalChecksByClinicQueryValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.ClinicId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Clinic is required")
                .MustAsync(ExistsClinic).WithMessage("Clinic is not valid");
        }

        private async Task<bool> ExistsClinic(int clinicId, CancellationToken cancellationToken)
        {
            return await _context.Clinics.AnyAsync(x => x.Id == clinicId && !x.Deleted, cancellationToken);
        }
    }
}
