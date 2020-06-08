using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateCountryCommandValidator : AbstractValidator<UpdateCountryCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCountryCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueCountry).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueCountry(UpdateCountryCommand updateCountryCommand, string name,
            CancellationToken cancellationToken)
        {
            return await _context.Countries
                .Where(x => x.Id != updateCountryCommand.Id)
                .AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}