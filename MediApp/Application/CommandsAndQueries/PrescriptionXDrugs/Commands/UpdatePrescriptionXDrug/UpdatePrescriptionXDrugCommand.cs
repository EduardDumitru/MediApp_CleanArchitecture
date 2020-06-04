using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdatePrescriptionXDrugCommand : IRequest<Result>
    {
        public long Id { get; set; }
        public long PrescriptionId { get; set; }
        public long DrugId { get; set; }
        public short Box { get; set; }
        public float PerInterval { get; set; }
        public string Interval { get; set; }
    }

    public class UpdatePrescriptionXDrugCommandHandler : IRequestHandler<UpdatePrescriptionXDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdatePrescriptionXDrugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdatePrescriptionXDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.PrescriptionXDrugs
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid link between prescription and drug found"});
            }

            entity.PrescriptionId = request.PrescriptionId;
            entity.DrugId = request.DrugId;
            entity.Box = request.Box;
            entity.PerInterval = request.PerInterval;
            entity.Interval = TimeSpan.Parse(request.Interval);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Link between prescription and drug was updated successfully");
        }
    }
}