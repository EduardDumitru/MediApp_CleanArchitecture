using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreDrugCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class RestoreDrugCommandHandler : IRequestHandler<RestoreDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreDrugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Drugs
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);
            ;

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid drug found"});
            }

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Drug was restored");
        }
    }
}