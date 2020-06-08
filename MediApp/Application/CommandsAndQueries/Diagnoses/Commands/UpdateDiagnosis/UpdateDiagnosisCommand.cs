using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateDiagnosisCommand : IRequest<Result>
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateDiagnosisCommandHandler : IRequestHandler<UpdateDiagnosisCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDiagnosisCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateDiagnosisCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Diagnoses
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null) return Result.Failure(new List<string> {"No valid diagnosis found"});

            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Diagnosis update was successful");
        }
    }
}