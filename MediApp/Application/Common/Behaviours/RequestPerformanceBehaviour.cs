using Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Behaviours
{
    public class RequestPerformanceBehaviour<TRequest, TResponse>(
        ILogger<TRequest> logger,
        ICurrentUserService currentUserService,
        IIdentityService identityService) : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly Stopwatch _timer = new();

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            _timer.Start();

            var response = await next(cancellationToken);

            _timer.Stop();

            var elapsedMilliseconds = _timer.ElapsedMilliseconds;

            if (elapsedMilliseconds > 500)
            {
                if (logger.IsEnabled(LogLevel.Warning)) // Check if logging is enabled
                {
                    var requestName = typeof(TRequest).Name;
                    var userId = currentUserService.UserId;
                    var userName = string.Empty;
                    if (userId.HasValue)
                    {
                        userName = await identityService.GetUserNameAsync(userId.Value);
                    }

                    logger.LogWarning(
                        "MediApp Long Running Request: {Name} ({ElapsedMilliseconds} milliseconds) {@UserId} {@UserName} {@Request}",
                        requestName, elapsedMilliseconds, userId, userName, request);
                }
            }

            return response;
        }
    }
}