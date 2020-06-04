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

            return Result.Success("Prescription was created successfully");
        }
    }
}