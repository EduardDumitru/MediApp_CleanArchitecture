﻿using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateEmployeeCommand : IRequest<Result>
    {
        public long Id { get; set; }
        public string StartHour { get; set; }
        public string EndHour { get; set; }
        public DateTime? TerminationDate { get; set; }
        public short EmployeeTypeId { get; set; }
        public short? MedicalCheckTypeId { get; set; }
        public int ClinicId { get; set; }
    }

    public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateEmployeeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Employees
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null) return Result.Failure(new List<string> {"No valid employee found"});

            entity.StartHour = TimeSpan.Parse(request.StartHour);
            entity.EndHour = TimeSpan.Parse(request.EndHour);
            entity.TerminationDate = request.TerminationDate?.ToLocalTime();
            entity.EmployeeTypeId = request.EmployeeTypeId;
            entity.MedicalCheckTypeId = request.MedicalCheckTypeId;
            entity.ClinicId = request.ClinicId;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Employee update was successful");
        }
    }
}