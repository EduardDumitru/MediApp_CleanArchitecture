using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddMedicalCheckCommand : IRequest<Result>
    {
        public DateTime Appointment { get; set; }
        public int ClinicId { get; set; }
        public long EmployeeId { get; set; }
        public long PatientId { get; set; }
        public short MedicalCheckTypeId { get; set; }
    }

    public class AddMedicalCheckCommandHandler : IRequestHandler<AddMedicalCheckCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddMedicalCheckCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddMedicalCheckCommand request, CancellationToken cancellationToken)
        {
            var entity = new MedicalCheck
            {
                Appointment = request.Appointment,
                ClinicId = request.ClinicId,
                EmployeeId = request.EmployeeId,
                PatientId = request.PatientId,
                MedicalCheckTypeId = request.MedicalCheckTypeId
            };

            await _context.MedicalChecks.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Medical Check was created successfully");
        }
    }
}