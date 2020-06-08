using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class DeletePrescriptionXDrugCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class DeletePrescriptionXDrugCommandCommandHandler : IRequestHandler<DeletePrescriptionXDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeletePrescriptionXDrugCommandCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeletePrescriptionXDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.PrescriptionXDrugs
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null)
                return Result.Failure(new List<string> {"No valid link between prescription and drug was found"});

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("The link between prescription and drug was deleted");
        }
    }
}