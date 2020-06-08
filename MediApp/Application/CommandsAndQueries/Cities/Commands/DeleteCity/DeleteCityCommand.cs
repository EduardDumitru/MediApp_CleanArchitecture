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
    public class DeleteCityCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class DeleteCityCommandHandler : IRequestHandler<DeleteCityCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteCityCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteCityCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Cities
                .Include(x => x.UserProfiles)
                .Include(x => x.Clinics)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded) return validationResult;

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("City was deleted");
        }

        private Result Validations(City entity)
        {
            var errors = new List<string>();

            if (entity == null) return Result.Failure(new List<string> {"No valid city found"});

            var isUsedInUserProfile = entity.UserProfiles.Any(x => !x.Deleted);

            if (isUsedInUserProfile) errors.Add("City is used in user profiles. You can't delete it while in use.");

            var isUsedInClinic = entity.Clinics.Any(x => !x.Deleted);

            if (isUsedInClinic) errors.Add("City is used in clinics. You can't delete it while in use.");

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}