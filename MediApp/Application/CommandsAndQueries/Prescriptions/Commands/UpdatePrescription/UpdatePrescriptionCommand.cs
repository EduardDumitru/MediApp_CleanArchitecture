using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdatePrescriptionCommand : IRequest<Result>
    {
        public long Id { get; set; }
        public int NoOfDays { get; set; }
        public string Description { get; set; }
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
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (prescription == null) return Result.Failure(new List<string> {"No valid prescription found"});

            prescription.Description = request.Description;
            prescription.NoOfDays = request.NoOfDays;

            _context.Prescriptions.Update(prescription);

            await _context.SaveChangesAsync(cancellationToken);
            return Result.Success("Prescription update was successful");
        }
    }
}