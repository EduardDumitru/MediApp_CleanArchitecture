using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddEmployeeTypeCommand : IRequest<Result>
    {
        public string Name { get; set; }
    }

    public class AddEmployeeTypeCommandHandler : IRequestHandler<AddEmployeeTypeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddEmployeeTypeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddEmployeeTypeCommand request, CancellationToken cancellationToken)
        {
            var entity = new EmployeeType
            {
                Name = request.Name
            };

            await _context.EmployeeTypes.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Employee Type was created successfully");
        }
    }
}