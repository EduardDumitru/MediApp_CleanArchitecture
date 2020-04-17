using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddMedicalCheckTypeCommand : IRequest<Result>
    {
        public string Name { get; set; }
    }

    public class AddMedicalCheckTypeCommandHandler : IRequestHandler<AddMedicalCheckTypeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddMedicalCheckTypeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddMedicalCheckTypeCommand request, CancellationToken cancellationToken)
        {
            var entity = new MedicalCheckType
            {
                Name = request.Name
            };

            await _context.MedicalCheckTypes.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Drug was created successfully");
        }
    }
}