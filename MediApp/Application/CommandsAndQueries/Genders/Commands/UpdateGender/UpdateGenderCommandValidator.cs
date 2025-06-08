using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateGenderCommandValidator : AbstractValidator<UpdateGenderCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateGenderCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueGender).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueGender(UpdateGenderCommand updateGenderCommand, string name,
            CancellationToken cancellationToken)
        {
            return await _context.Genders
                .Where(x => x.Id != updateGenderCommand.Id)
                .AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}