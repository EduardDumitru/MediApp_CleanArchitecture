using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddCountryCommand : IRequest<Result>
    {
        public string Name { get; set; }
    }

    public class AddCountryCommandHandler : IRequestHandler<AddCountryCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddCountryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddCountryCommand request, CancellationToken cancellationToken)
        {
            var entity = new Country
            {
                Name = request.Name
            };

            await _context.Countries.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Country was created successfully");
        }
    }
}