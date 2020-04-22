using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddPrescriptionCommand : IRequest<Result>
    {
        public int NoOfDays { get; set; }
        public string Description { get; set; }
        public long PatientId { get; set; }
        public long MedicalCheckId { get; set; }
        public long EmployeeId { get; set; }
        public IList<AddPrescriptionXDrugDto> PrescriptionXDrugs { get; set; }
    }

    public class AddPrescriptionCommandHandler : IRequestHandler<AddPrescriptionCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddPrescriptionCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddPrescriptionCommand request, CancellationToken cancellationToken)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                var prescription = new Prescription
                {
                    EmployeeId = request.EmployeeId,
                    NoOfDays = request.NoOfDays,
                    Description = request.Description,
                    PatientId = request.PatientId,
                    MedicalCheckId = request.MedicalCheckId
                };

                await _context.Prescriptions.AddAsync(prescription, cancellationToken);

                await _context.SaveChangesAsync(cancellationToken);

                var prescriptionXDrugs = request.PrescriptionXDrugs.Select(prescriptionXDrug => new PrescriptionXDrug
                    {
                        PerInterval = prescriptionXDrug.PerInterval,
                        PrescriptionId = prescription.Id,
                        DrugId = prescriptionXDrug.DrugId,
                        Interval = prescriptionXDrug.Interval,
                        Box = prescriptionXDrug.Box
                    }).ToList();

                await _context.PrescriptionXDrugs.AddRangeAsync(prescriptionXDrugs, cancellationToken);

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                return Result.Success("Prescription was created successfully");
            } 
            catch (Exception e)
            {
                await transaction.RollbackAsync(cancellationToken);

                return Result.Failure(new List<string>
                {
                    $"We could not process this prescription add because of this error: {e.Message}. " +
                    "If it keeps repeating, contact us!"
                });
            }
        }
    }
}