using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddCityCommand : IRequest<Result>
    {
        public string Name { get; set; }
        public int CountyId { get; set; }
    }

    public class AddCityCommandHandler : IRequestHandler<AddCityCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddCityCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddCityCommand request, CancellationToken cancellationToken)
        {
            var entity = new City
            {
                Name = request.Name,
                CountyId = request.CountyId
            };

            await _context.Cities.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("City was created successfully");
        }
    }
}