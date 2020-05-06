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
    public class DeleteEmployeeTypeCommand : IRequest<Result>
    {
        public short Id { get; set; }
    }

    public class DeleteEmployeeTypeCommandHandler : IRequestHandler<DeleteEmployeeTypeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteEmployeeTypeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteEmployeeTypeCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.EmployeeTypes
                .Include(x => x.Employees)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }
            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Employee Type was deleted");
        }

        private Result Validations(EmployeeType entity)
        {
            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid employee type found"});
            }

            var isUsedInEmployee = entity.Employees.Any(x => !x.Deleted);

            if (isUsedInEmployee)
            {
                return Result.Failure(new List<string> {"Employee type is used in employees. You can't delete it"});
            }

            return Result.Success();
        }
    }
}