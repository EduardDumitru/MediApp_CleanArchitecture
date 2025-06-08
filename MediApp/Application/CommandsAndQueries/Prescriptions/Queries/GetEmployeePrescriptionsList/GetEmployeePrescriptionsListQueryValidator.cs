using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetEmployeePrescriptionsListQueryValidator : AbstractValidator<GetEmployeePrescriptionsListQuery>
    {
        private readonly IApplicationDbContext _context;

        public GetEmployeePrescriptionsListQueryValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.EmployeeId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Employee is required")
                .MustAsync(ExistsEmployee).WithMessage("Employee is not valid");
        }

        private async Task<bool> ExistsEmployee(long employeeId, CancellationToken cancellationToken)
        {
            return await _context.Employees.AnyAsync(x => x.Id == employeeId && !x.Deleted, cancellationToken);
        }
    }
}