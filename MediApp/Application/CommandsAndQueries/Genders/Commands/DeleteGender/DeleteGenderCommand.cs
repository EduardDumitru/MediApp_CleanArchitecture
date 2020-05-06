using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class DeleteGenderCommand : IRequest<Result>
    {
        public short Id { get; set; }
    }

    public class DeleteGenderCommandHandler : IRequestHandler<DeleteGenderCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        public DeleteGenderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteGenderCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Genders
                .Include(x => x.UserProfiles)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Gender was deleted");
        }

        private Result Validations(Gender entity)
        {
            var errors = new List<string>();

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid gender found"});
            }

            var isUsedInUserProfile = entity.UserProfiles.Any(x => !x.Deleted);

            if (isUsedInUserProfile)
            {
                errors.Add("Gender is used in user profile. You can't delete it while in use.");
            }

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}
