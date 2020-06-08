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
    public class DeletePrescriptionCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class DeletePrescriptionCommandHandler : IRequestHandler<DeletePrescriptionCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeletePrescriptionCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeletePrescriptionCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Prescriptions
                .Include(x => x.PrescriptionXDrugs)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded) return validationResult;

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Prescription was deleted");
        }

        private Result Validations(Prescription entity)
        {
            var errors = new List<string>();

            if (entity == null) return Result.Failure(new List<string> {"No valid prescription found"});

            var isUsedInPrescriptionXDrugs = entity.PrescriptionXDrugs.Any(x => !x.Deleted);

            if (isUsedInPrescriptionXDrugs)
                errors.Add("Prescription is used in the link between this Prescription and Drugs. " +
                           "You must delete the links first.");

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}