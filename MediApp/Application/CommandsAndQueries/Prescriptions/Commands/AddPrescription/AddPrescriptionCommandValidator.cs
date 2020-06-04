using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddPrescriptionCommandValidator: AbstractValidator<AddPrescriptionCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddPrescriptionCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.EmployeeId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Employee is required")
                .MustAsync(ExistsEmployee).WithMessage("Employee is not valid");
            RuleFor(x => x.PatientId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Patient is required")
                .MustAsync(ExistsPatient).WithMessage("Patient is not valid");
            RuleFor(x => x.MedicalCheckId)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Medical Check is required")
                .MustAsync(ExistsMedicalCheck).WithMessage("Medical Check is not valid");
        }

        private async Task<bool> ExistsEmployee(long employeeId, CancellationToken cancellationToken)
        {
            return await _context.Employees
                .AnyAsync(x => x.Id == employeeId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsPatient(long patientId, CancellationToken cancellationToken)
        {
            return await _context.UserProfiles
                .AnyAsync(x => x.Id == patientId && !x.Deleted, cancellationToken);
        }

        private async Task<bool> ExistsMedicalCheck(long medicalCheckId, CancellationToken cancellationToken)
        {
            return await _context.MedicalChecks
                .AnyAsync(x => x.Id == medicalCheckId && !x.Deleted, cancellationToken);
        }
    }
}