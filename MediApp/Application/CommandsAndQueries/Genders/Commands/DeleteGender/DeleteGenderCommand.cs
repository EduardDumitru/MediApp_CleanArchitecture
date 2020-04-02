using System;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
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
            var entity = await _context.Genders.FindAsync(request.Id);

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid gender found"});
            }

            var isUsedInUserProfile =
                await _context.UserProfiles.AnyAsync(x => x.GenderId == entity.Id, cancellationToken);

            if (isUsedInUserProfile)
            {
                return Result.Failure(new List<string> {"Gender is used. You can't delete it"});
            }

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Gender was deleted");
        }
    }
}
