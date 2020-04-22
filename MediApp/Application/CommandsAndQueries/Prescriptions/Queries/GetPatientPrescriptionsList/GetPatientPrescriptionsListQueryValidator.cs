using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetPatientPrescriptionsListQueryValidator : AbstractValidator<GetPatientPrescriptionsListQuery>
    {
        private readonly IApplicationDbContext _context;

        public GetPatientPrescriptionsListQueryValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.PatientId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Patient is required")
                .MustAsync(ExistsPatient).WithMessage("Patient is not valid");
        }

        private async Task<bool> ExistsPatient(long patientId, CancellationToken cancellationToken)
        {
            return await _context.UserProfiles.AnyAsync(x => x.Id == patientId, cancellationToken);
        }
    }
}