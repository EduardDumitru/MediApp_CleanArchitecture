using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries.Cities.Commands.UpdateCity
{
    public class UpdateCityCommandValidator : AbstractValidator<UpdateCityCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCityCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.CountyId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("County is required")
                .MustAsync(ExistsCounty).WithMessage("County is not valid");
        }

        private async Task<bool> ExistsCounty(int countyId, CancellationToken cancellationToken)
        {
            return await _context.Counties
                .AnyAsync(x => x.Id == countyId && !x.Deleted, cancellationToken);
        }
    }
}