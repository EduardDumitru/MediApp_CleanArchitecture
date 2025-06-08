using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddPrescriptionXDrugCommandValidator : AbstractValidator<AddPrescriptionXDrugCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddPrescriptionXDrugCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.PrescriptionId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Diagnosis is required")
                .MustAsync(ExistsPrescription).WithMessage("Prescription is not valid");
            RuleFor(x => x.DrugId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Drug is required")
                .MustAsync(ExistsDrug).WithMessage("Drug is not valid");
            RuleFor(x => x.Box)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Box is required");
            RuleFor(x => x.PerInterval)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Per interval is required");
            RuleFor(x => x.Interval)
                .Cascade(CascadeMode.Stop)
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