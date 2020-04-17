using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreMedicalCheckTypeCommand : IRequest<Result>
    {
        public short Id { get; set; }
    }

    public class RestoreMedicalCheckTypeCommandHandler : IRequestHandler<RestoreMedicalCheckTypeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreMedicalCheckTypeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreMedicalCheckTypeCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.MedicalCheckTypes
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);
            ;

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid medical check type found"});
            }

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Medical Check Type was restored");
        }
    }
}