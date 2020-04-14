using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreCountyCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class RestoreCountyCommandHandler : IRequestHandler<RestoreCountyCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreCountyCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreCountyCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Counties
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);
            ;

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid county found"});
            }

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("County was restored");
        }
    }
}
