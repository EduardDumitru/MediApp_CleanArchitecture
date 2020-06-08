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
                .Include(x => x.Country)
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded) return validationResult;

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("County was restored");
        }

        private Result Validations(County entity)
        {
            var errors = new List<string>();

            if (entity == null) return Result.Failure(new List<string> {"No valid county found"});

            if (entity.Country == null || entity.Country != null && entity.Country.Deleted)
                errors.Add("County is deleted. You must update that first.");

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}