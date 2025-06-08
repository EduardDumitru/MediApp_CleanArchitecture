using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateEmployeeTypeCommandValidator : AbstractValidator<UpdateEmployeeTypeCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateEmployeeTypeCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueEmployeeType).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueEmployeeType(UpdateEmployeeTypeCommand updateEmployeeTypeCommand, string name,
            CancellationToken cancellationToken)
        {
            return await _context.EmployeeTypes
                .Where(x => x.Id != updateEmployeeTypeCommand.Id)
                .AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}