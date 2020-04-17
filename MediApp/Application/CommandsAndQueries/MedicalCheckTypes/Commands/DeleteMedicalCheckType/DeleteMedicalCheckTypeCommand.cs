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
    public class DeleteMedicalCheckTypeCommand : IRequest<Result>
    {
        public short Id { get; set; }
    }

    public class DeleteMedicalCheckTypeCommandHandler : IRequestHandler<DeleteMedicalCheckTypeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public DeleteMedicalCheckTypeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(DeleteMedicalCheckTypeCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.MedicalCheckTypes
                .Include(x => x.Employees)
                .Include(x => x.MedicalChecks)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }

            entity.Deleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Drug was deleted");
        }

        private Result Validations(MedicalCheckType entity)
        {
            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid medical check type found"});
            }

            var isUsedInEmployees = entity.Employees.Any(x => !x.Deleted);

            if (isUsedInEmployees)
            {
                return Result.Failure(new List<string> {"Medical check type is used in employees. You can't delete it"});
            }

            var isUsedInMedicalChecks = entity.MedicalChecks.Any(x => !x.Deleted);

            if (isUsedInMedicalChecks)
            {
                return Result.Failure(new List<string> {"Medical check type is used in medical checks. You can't delete it"});
            }

            return Result.Success();
        }
    }
}