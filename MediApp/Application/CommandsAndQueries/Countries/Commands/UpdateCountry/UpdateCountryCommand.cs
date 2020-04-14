using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class UpdateCountryCommand : IRequest<Result>
    {
        public short Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateCountryCommandHandler : IRequestHandler<UpdateCountryCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCountryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateCountryCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Countries.FindAsync(request.Id);

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid country found"});
            }

            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Country update was successful");
        }
    }
}
