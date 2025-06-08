using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetDrugsByPrescriptionListQueryValidator : AbstractValidator<GetDrugsByPrescriptionListQuery>
    {
        private readonly IApplicationDbContext _context;

        public GetDrugsByPrescriptionListQueryValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.PrescriptionId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Prescription is required")
                .MustAsync(ExistsPrescription).WithMessage("Prescription is not valid");
        }

        private async Task<bool> ExistsPrescription(long prescriptionId, CancellationToken cancellationToken)
        {
            return await _context.Prescriptions.AnyAsync(x => x.Id == prescriptionId, cancellationToken);
        }
    }
}