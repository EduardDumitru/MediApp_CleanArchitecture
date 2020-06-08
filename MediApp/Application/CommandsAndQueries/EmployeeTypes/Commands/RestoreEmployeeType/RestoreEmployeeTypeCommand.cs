using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreEmployeeTypeCommand : IRequest<Result>
    {
        public short Id { get; set; }
    }

    public class RestoreEmployeeTypeCommandHandler : IRequestHandler<RestoreEmployeeTypeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreEmployeeTypeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreEmployeeTypeCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.EmployeeTypes
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);

            if (entity == null) return Result.Failure(new List<string> {"No valid employee type found"});

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Employee type was restored");
        }
    }
}