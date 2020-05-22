using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateDrugCommand : IRequest<Result>
    {
        public long Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateDrugCommandHandler : IRequestHandler<UpdateDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDrugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Drugs
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid drug found"});
            }

            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Drug update was successful");
        }
    }
}