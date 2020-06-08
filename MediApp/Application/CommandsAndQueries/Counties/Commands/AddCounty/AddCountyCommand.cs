using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddCountyCommand : IRequest<Result>
    {
        public string Name { get; set; }
        public short CountryId { get; set; }
    }

    public class AddCountyCommandHandler : IRequestHandler<AddCountyCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddCountyCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddCountyCommand request, CancellationToken cancellationToken)
        {
            var entity = new County
            {
                Name = request.Name,
                CountryId = request.CountryId
            };

            await _context.Counties.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("County was created successfully");
        }
    }
}