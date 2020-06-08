using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateEmployeeTypeCommand : IRequest<Result>
    {
        public short Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateEmployeeTypeCommandHandler : IRequestHandler<UpdateEmployeeTypeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateEmployeeTypeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateEmployeeTypeCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.EmployeeTypes
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null) return Result.Failure(new List<string> {"No valid employee type found"});

            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Employee Type update was successful");
        }
    }
}