using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class DeleteDiagnosisXDrugCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class DeleteDiagnosisXDrugCommandHandler : IRequestHandler<DeleteDiagnosisXDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteDiagnosisXDrugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteDiagnosisXDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.DiagnosisXDrugs
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null)
                return Result.Failure(new List<string> {"No valid link between diagnosis and drug was found"});

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("The link between diagnosis and drug was deleted");
        }
    }
}