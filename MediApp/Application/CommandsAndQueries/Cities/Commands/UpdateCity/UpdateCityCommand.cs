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
    public class UpdateCityCommand : IRequest<Result>
    {
        public int Id { get; set; }
        public int CountyId { get; set; }
        public string Name { get; set; }
    }

    public class UpdateCityCommandHandler : IRequestHandler<UpdateCityCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCityCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateCityCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Cities
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid city found"});
            }

            entity.Name = request.Name;
            entity.CountyId = request.CountyId;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("City update was successful");
        }
    }
}
