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
    public class AddGenderCommand : IRequest<Result>
    {
        public string Name { get; set; }
    }

    public class AddGenderCommandHandler : IRequestHandler<AddGenderCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddGenderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Result> Handle(AddGenderCommand request, CancellationToken cancellationToken)
        {
            var entity = new Gender
            {
                Name = request.Name
            };

            await _context.Genders.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Gender was created successfully");
        }
    }
}
