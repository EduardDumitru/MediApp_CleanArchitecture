using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateMedicalCheckTypeCommandValidator : AbstractValidator<UpdateMedicalCheckTypeCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateMedicalCheckTypeCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Id is required");
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required")
                .MustAsync(BeUniqueMedicalCheckType).WithMessage("Name already exists");
        }

        private async Task<bool> BeUniqueMedicalCheckType(UpdateMedicalCheckTypeCommand updateMedicalCheckType, string name,
            CancellationToken cancellationToken)
        {
            return await _context.MedicalCheckTypes
                .Where(x => x.Id != updateMedicalCheckType.Id)
                .AllAsync(x => x.Name != name, cancellationToken);
        }
    }
}