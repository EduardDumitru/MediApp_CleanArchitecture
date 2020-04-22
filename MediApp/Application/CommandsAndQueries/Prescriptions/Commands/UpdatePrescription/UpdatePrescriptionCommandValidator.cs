using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdatePrescriptionCommandValidator: AbstractValidator<UpdatePrescriptionCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdatePrescriptionCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.PrescriptionXDrugs)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Drugs are required")
                .MustAsync(ExistsDrugs).WithMessage("Drugs are not valid");
        }

        private async Task<bool> ExistsDrugs(IList<UpdatePrescriptionXDrugDto> prescriptionXDrugs, CancellationToken cancellationToken)
        {
            var drugIds = prescriptionXDrugs.Select(x => x.DrugId).Distinct();
            var nrOfDrugsValid = await _context.Drugs.Where(x => drugIds.Contains(x.Id)).LongCountAsync(cancellationToken);
            return drugIds.LongCount() == nrOfDrugsValid;
        }
    }
}