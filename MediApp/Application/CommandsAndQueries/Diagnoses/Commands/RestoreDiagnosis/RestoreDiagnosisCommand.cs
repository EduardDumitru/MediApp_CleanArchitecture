using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries.Diagnoses
{
    public class RestoreDiagnosisCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class RestorDiagnosisCommandHandler : IRequestHandler<RestoreDiagnosisCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestorDiagnosisCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreDiagnosisCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Diagnoses
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);
            ;

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid diagnosis found"});
            }

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Diagnosis was restored");
        }
    }
}
