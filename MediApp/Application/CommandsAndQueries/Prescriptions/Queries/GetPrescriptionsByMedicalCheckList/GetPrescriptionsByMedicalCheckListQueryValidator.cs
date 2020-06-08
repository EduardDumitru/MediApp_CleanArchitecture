using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class
        GetPrescriptionsByMedicalCheckListQueryValidator : AbstractValidator<GetPrescriptionsByMedicalCheckListQuery>
    {
        private readonly IApplicationDbContext _context;

        public GetPrescriptionsByMedicalCheckListQueryValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.MedicalCheckId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Medical check is required")
                .MustAsync(ExistsMedicalCheck).WithMessage("Medical check is not valid");
        }

        private async Task<bool> ExistsMedicalCheck(long medicalCheckId, CancellationToken cancellationToken)
        {
            return await _context.MedicalChecks.AnyAsync(x => x.Id == medicalCheckId && !x.Deleted, cancellationToken);
        }
    }
}