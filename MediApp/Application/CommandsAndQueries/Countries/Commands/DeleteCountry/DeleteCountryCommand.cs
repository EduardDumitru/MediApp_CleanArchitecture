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
    public class DeleteCountryCommand : IRequest<Result>
    {
        public short Id { get; set; }
    }

    public class DeleteCountryCommandHandler : IRequestHandler<DeleteCountryCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteCountryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteCountryCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Countries
                .Include(x => x.UserProfiles)
                .Include(x => x.Counties)
                .Include(x => x.Clinics)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded) return validationResult;
            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Country was deleted");
        }

        private Result Validations(Country entity)
        {
            if (entity == null) return Result.Failure(new List<string> {"No valid country found"});

            var isUsedInUserProfile = entity.UserProfiles.Any(x => !x.Deleted);

            if (isUsedInUserProfile)
                return Result.Failure(new List<string> {"Country is used in user profiles. You can't delete it"});

            var isUsedInCounties = entity.Counties.Any(x => !x.Deleted);

            if (isUsedInCounties)
                return Result.Failure(new List<string> {"Country is used in counties. You can't delete it"});

            var isUsedInClinic = entity.Clinics.Any(x => !x.Deleted);

            if (isUsedInClinic)
                return Result.Failure(new List<string> {"Country is used in clinics. You can't delete it"});

            return Result.Success();
        }
    }
}