using Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.System.Commands.SeedSampleData
{
    public class SeedSampleDataCommand : IRequest
    {
    }

    public class SeedSampleDataCommandHandler(IApplicationDbContext context, IIdentityService identityService,
        IDateTime dateTimeService) : IRequestHandler<SeedSampleDataCommand>
    {
        public async Task<Unit> Handle(SeedSampleDataCommand _, CancellationToken cancellationToken)
        {
            var seeder = new SampleDataSeeder(context, identityService, dateTimeService);

            await seeder.SeedAllAsync(cancellationToken);

            return Unit.Value;
        }

        async Task IRequestHandler<SeedSampleDataCommand>.Handle(SeedSampleDataCommand request, CancellationToken cancellationToken)
        {
            await Handle(request, cancellationToken);
        }
    }
}