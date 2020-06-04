using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdatePrescriptionXDrugCommandValidator: AbstractValidator<UpdatePrescriptionXDrugCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdatePrescriptionXDrugCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.PrescriptionId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Diagnosis is required")
                .MustAsync(ExistsPrescription).WithMessage("Prescription is not valid");
            RuleFor(x => x.DrugId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Drug is required")
                .MustAsync(ExistsDrug).WithMessage("Drug is not valid");
            RuleFor(x => x.Box)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Box is required");
            RuleFor(x => x.PerInterval)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Per interval is required");
            RuleFor(x => x.Interval)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Interval is required")
                .MustAsync(BeValidTimeSpan).WithMessage("Interval is not correctly configured");
        }

        private async Task<bool> ExistsPrescription(long prescriptionId, CancellationToken cancellationToken)
        {
            return await _context.Prescriptions
                .AnyAsync(x => x.Id == prescriptionId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsDrug(long drugId, CancellationToken cancellationToken)
        {
            return await _context.Drugs
                .AnyAsync(x => x.Id == drugId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> BeValidTimeSpan(string time, CancellationToken cancellationToken)
        {
            var result = await Task.FromResult(TimeSpan.TryParseExact(time, "h\\:mm\\:ss", CultureInfo.CurrentCulture,
                TimeSpanStyles.None,
                out _));
            return result;
        }
    }
}