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
    public class UpdateGenderCommand : IRequest<Result>
    {
        public short Id { get; set; }
        public string Name { get; set; }
    }

    public class UpdateGenderCommandHandler : IRequestHandler<UpdateGenderCommand, Result>
    {
        private readonly IApplicationDbContext _context;
        public UpdateGenderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateGenderCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Genders.FindAsync(request.Id);

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid gender found"});
            }

            entity.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Gender update was successful");
        }
    }

}
