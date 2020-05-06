using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddEmployeeCommand : IRequest<Result>
    {
        public TimeSpan StartHour { get; set; }
        public TimeSpan EndHour { get; set; }
        public long UserProfileId { get; set; }
        public short EmployeeTypeId { get; set; }
        public short? MedicalCheckTypeId { get; set; }
        public int ClinicId { get; set; }
    }

    public class AddEmployeeCommandHandler : IRequestHandler<AddEmployeeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddEmployeeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddEmployeeCommand request, CancellationToken cancellationToken)
        {
            var entity = new Employee
            {
                StartHour = request.StartHour,
                EndHour = request.EndHour,
                UserProfileId = request.UserProfileId,
                EmployeeTypeId = request.EmployeeTypeId,
                MedicalCheckTypeId = request.MedicalCheckTypeId,
                ClinicId = request.ClinicId
            };

            await _context.Employees.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Employee was created successfully");
        }
    }
}