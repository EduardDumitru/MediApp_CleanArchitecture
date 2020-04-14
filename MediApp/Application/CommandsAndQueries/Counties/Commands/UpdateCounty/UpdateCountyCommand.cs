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
    public class UpdateCountyCommand : IRequest<Result>
    {
        public int Id { get; set; }
        public short CountryId { get; set; }
        public string Name { get; set; }
    }

    public class UpdateCountyCommandHandler : IRequestHandler<UpdateCountyCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCountyCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateCountyCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Counties
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid county found"});
            }

            entity.Name = request.Name;
            entity.CountryId = request.CountryId;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("County update was successful");
        }
    }
}
