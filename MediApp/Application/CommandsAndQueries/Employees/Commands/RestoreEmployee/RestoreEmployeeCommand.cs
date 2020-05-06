using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreEmployeeCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class RestoreEmployeeCommandHandler : IRequestHandler<RestoreEmployeeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreEmployeeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreEmployeeCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Employees
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);
            ;

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid employee found"});
            }

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Employee was restored");
        }
    }
}