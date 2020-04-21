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
    public class AddDiagnosisXDrugCommand : IRequest<Result>
    {
        public int DiagnosisId { get; set; }
        public long DrugId { get; set; }
    }

    public class AddDiagnosisXDrugCommandHandler : IRequestHandler<AddDiagnosisXDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddDiagnosisXDrugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddDiagnosisXDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = new DiagnosisXDrug
            {
                DiagnosisId = request.DiagnosisId,
                DrugId = request.DrugId
            };

            await _context.DiagnosisXDrugs.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Link between diagnosis and drug was created successfully");
        }
    }
}
