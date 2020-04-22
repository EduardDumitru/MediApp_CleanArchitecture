using System;
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
    public class UpdatePrescriptionCommand : IRequest<Result>
    {
        public long Id { get; set; }
        public int NoOfDays { get; set; }
        public string Description { get; set; }
        public IList<UpdatePrescriptionXDrugDto> PrescriptionXDrugs { get; set; }
    }
    
    public class UpdatePrescriptionCommandHandler : IRequestHandler<UpdatePrescriptionCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdatePrescriptionCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdatePrescriptionCommand request, CancellationToken cancellationToken)
        {
            var prescription = await _context.Prescriptions
                .Include(x => x.PrescriptionXDrugs)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (prescription == null)
            {
                return Result.Failure(new List<string> {"No valid prescription found"});
            }

            await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                prescription.Description = request.Description;
                prescription.NoOfDays = request.NoOfDays;

                _context.Prescriptions.Update(prescription);

                var prescriptionXDrugsIds = request.PrescriptionXDrugs.Select(x => x.Id);

                var currentPrescriptionXDrugs = await _context.PrescriptionXDrugs
                    .Where(x => prescriptionXDrugsIds.Contains(x.Id)).ToListAsync(cancellationToken);

                var updatedPrescriptionXDrugs = new List<PrescriptionXDrug>();
                foreach (var prescriptionXDrug in request.PrescriptionXDrugs)
                {
                    var currentPxD = currentPrescriptionXDrugs
                        .FirstOrDefault(x => x.Id == prescriptionXDrug.Id);
                    if (currentPxD.Box != prescriptionXDrug.Box || currentPxD.DrugId != prescriptionXDrug.DrugId
                                                                || currentPxD.PerInterval != prescriptionXDrug.PerInterval
                                                                || currentPxD.Interval != prescriptionXDrug.Interval)
                    {
                        currentPxD.Interval = prescriptionXDrug.Interval;
                        currentPxD.PerInterval = prescriptionXDrug.PerInterval;
                        currentPxD.DrugId = prescriptionXDrug.DrugId;
                        currentPxD.Box = prescriptionXDrug.Box;
                        updatedPrescriptionXDrugs.Add(currentPxD);
                    }
                }

                _context.PrescriptionXDrugs.UpdateRange(updatedPrescriptionXDrugs);

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                return Result.Success("Prescription update was successful");
            }
            catch (Exception e)
            {
                await transaction.RollbackAsync(cancellationToken);

                return Result.Failure(new List<string>
                {
                    $"We could not process this prescription update because of this error: {e.Message}. " +
                    "If it keeps repeating, contact us!"
                });
            }
        }
    }
}