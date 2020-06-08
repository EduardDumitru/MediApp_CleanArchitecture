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
    public class DeleteCountyCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class DeleteCountyCommandHandler : IRequestHandler<DeleteCountyCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteCountyCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteCountyCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Counties
                .Include(x => x.UserProfiles)
                .Include(x => x.Cities)
                .Include(x => x.Clinics)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded) return validationResult;

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("County was deleted");
        }

        private Result Validations(County entity)
        {
            var errors = new List<string>();

            if (entity == null) return Result.Failure(new List<string> {"No valid county found"});

            var isUsedInUserProfile = entity.UserProfiles.Any(x => !x.Deleted);

            if (isUsedInUserProfile) errors.Add("County is used in user profiles. You can't delete it while in use.");

            var isUsedInCity = entity.Cities.Any(x => !x.Deleted);

            if (isUsedInCity) errors.Add("County is used in cities. You can't delete it while in use.");

            var isUsedInClinic = entity.Clinics.Any(x => !x.Deleted);

            if (isUsedInClinic) errors.Add("County is used in clinics. You can't delete it while in use.");

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}