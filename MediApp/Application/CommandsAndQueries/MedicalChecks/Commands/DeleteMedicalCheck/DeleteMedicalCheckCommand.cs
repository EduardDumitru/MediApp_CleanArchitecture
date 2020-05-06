using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class DeleteMedicalCheckCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class DeleteMedicalCheckCommandHandler : IRequestHandler<DeleteMedicalCheckCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteMedicalCheckCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteMedicalCheckCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.MedicalChecks
                .Include(x => x.Prescriptions)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Medical Check was deleted");
        }

        private Result Validations(MedicalCheck entity)
        {
            var errors = new List<string>();

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid medical check found"});
            }

            var isUsedInPrescriptions = entity.Prescriptions.Any(x => !x.Deleted);

            if (isUsedInPrescriptions)
            {
                errors.Add("Medical Check is used in the link with Prescriptions. You must delete the links first.");
            }

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}