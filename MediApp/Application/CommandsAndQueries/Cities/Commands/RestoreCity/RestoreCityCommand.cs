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
    public class RestoreCityCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class RestoreCityCommandHandler : IRequestHandler<RestoreCityCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreCityCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreCityCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Cities
                .Include(x => x.County)
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded) return validationResult;

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("City was restored");
        }

        private Result Validations(City entity)
        {
            var errors = new List<string>();

            if (entity == null) return Result.Failure(new List<string> {"No valid city found"});

            if (entity.County == null || entity.County != null && entity.County.Deleted)
                errors.Add("County is deleted. You must update that first.");

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}