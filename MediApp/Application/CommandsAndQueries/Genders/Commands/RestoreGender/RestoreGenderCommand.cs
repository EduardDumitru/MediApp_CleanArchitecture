using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;

namespace Application.CommandsAndQueries.Genders.Commands.RestoreGender
{
    public class RestoreGenderCommand : IRequest<Result>
    {
        public short Id { get; set; }
    }

    public class RestoreGenderCommandHandler : IRequestHandler<RestoreGenderCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        public RestoreGenderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreGenderCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Genders.FindAsync(request.Id);

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid gender found"});
            }

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Gender was restored");
        }
    }
}
