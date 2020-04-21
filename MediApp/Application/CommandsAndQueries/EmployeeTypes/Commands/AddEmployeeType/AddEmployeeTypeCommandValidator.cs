using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class AddEmployeeTypeCommandValidator : AbstractValidator<AddEmployeeTypeCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddEmployeeTypeCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueEmployeeType).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueEmployeeType(string name, CancellationToken cancellationToken)
        {
            return await _context.EmployeeTypes.AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}