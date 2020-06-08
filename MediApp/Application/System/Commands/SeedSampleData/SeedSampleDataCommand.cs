using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;

namespace Application.System.Commands.SeedSampleData
{
    public class SeedSampleDataCommand : IRequest
    {
    }

    public class SeedSampleDataCommandHandler : IRequestHandler<SeedSampleDataCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IDateTime _dateTimeService;
        private readonly IIdentityService _identityService;

        public SeedSampleDataCommandHandler(IApplicationDbContext context, IIdentityService identityService,
            IDateTime dateTimeService)
        {
            _context = context;
            _identityService = identityService;
            _dateTimeService = dateTimeService;
        }

        public async Task<Unit> Handle(SeedSampleDataCommand request, CancellationToken cancellationToken)
        {
            var seeder = new SampleDataSeeder(_context, _identityService, _dateTimeService);

            await seeder.SeedAllAsync(cancellationToken);

            return Unit.Value;
        }
    }
}