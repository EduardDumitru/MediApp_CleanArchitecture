using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreClinicCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class RestoreClinicCommandHandler : IRequestHandler<RestoreClinicCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreClinicCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreClinicCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Clinics
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);
            ;

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid clinic found"});
            }

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Clinic was restored");
        }
    }
}
