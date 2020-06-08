using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreCountryCommand : IRequest<Result>
    {
        public short Id { get; set; }
    }

    public class RestoreCountryCommandHandler : IRequestHandler<RestoreCountryCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreCountryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreCountryCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Countries
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);
            ;

            if (entity == null) return Result.Failure(new List<string> {"No valid country found"});

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Country was restored");
        }
    }
}