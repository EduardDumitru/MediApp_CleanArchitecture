using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateMedicalCheckCommand : IRequest<Result>
    {
        public long Id { get; set; }
        public int DiagnosisId { get; set; }
    }

    public class UpdateMedicalCheckCommandHandler : IRequestHandler<UpdateMedicalCheckCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateMedicalCheckCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateMedicalCheckCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.MedicalChecks
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null) return Result.Failure(new List<string> {"No valid medical check found"});

            entity.DiagnosisId = request.DiagnosisId;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Medical check update was successful");
        }
    }
}