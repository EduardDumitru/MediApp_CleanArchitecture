using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddDiagnosisCommand : IRequest<Result>
    {
        public string Name { get; set; }
    }

    public class AddDiagnosisCommandHandler : IRequestHandler<AddDiagnosisCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddDiagnosisCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddDiagnosisCommand request, CancellationToken cancellationToken)
        {
            var entity = new Diagnosis
            {
                Name = request.Name
            };

            await _context.Diagnoses.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Country was created successfully");
        }
    }
}
