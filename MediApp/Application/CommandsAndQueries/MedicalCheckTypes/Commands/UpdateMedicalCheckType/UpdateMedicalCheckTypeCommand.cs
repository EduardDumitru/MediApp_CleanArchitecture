using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateMedicalCheckTypeCommand : IRequest<Result>
    {
        public short Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateMedicalCheckTypeCommandHandler : IRequestHandler<UpdateMedicalCheckTypeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateMedicalCheckTypeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateMedicalCheckTypeCommand request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.MedicalCheckTypes
                .FirstOrDefaultAsync(x => x.Id == request.Id
                                          && !x.Deleted, cancellationToken);

            if (entity == null) return Result.Failure(new List<string> {"No valid medical check type found"});

            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Medical check type update was successful");
        }
    }
}