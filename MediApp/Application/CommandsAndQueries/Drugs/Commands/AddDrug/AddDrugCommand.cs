using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddDrugCommand : IRequest<Result>
    {
        public string Name { get; set; }
    }

    public class AddDrugCommandHandler : IRequestHandler<AddDrugCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddDrugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddDrugCommand request, CancellationToken cancellationToken)
        {
            var entity = new Drug
            {
                Name = request.Name
            };

            await _context.Drugs.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Drug was created successfully");
        }
    }
}