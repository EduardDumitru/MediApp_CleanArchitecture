using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddPrescriptionXDrugCommand : IRequest<Result>
    {
        public long PrescriptionId { get; set; }
        public long DrugId { get; set; }
        public short Box { get; set; }
        public float PerInterval { get; set; }
        public string Interval { get; set; }
    }

    public class AddPrescriptionXDrugCommandHandler : IRequestHandler<AddPrescriptionXDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddPrescriptionXDrugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddPrescriptionXDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = new PrescriptionXDrug
            {
                PrescriptionId = request.PrescriptionId,
                DrugId = request.DrugId,
                Box = request.Box,
                PerInterval = request.PerInterval,
                Interval = TimeSpan.Parse(request.Interval)
            };

            await _context.PrescriptionXDrugs.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Link between prescription and drug was created successfully");
        }
    }
}