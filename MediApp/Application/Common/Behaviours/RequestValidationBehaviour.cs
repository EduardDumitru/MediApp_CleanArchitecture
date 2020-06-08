using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using ValidationException = Application.Common.Exceptions.ValidationException;

namespace Application.Common.Behaviours
{
    public class RequestValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;

        public RequestValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        {
            _validators = validators;
        }

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken,
            RequestHandlerDelegate<TResponse> next)
        {
            var context = new ValidationContext(request);

            var validators = _validators
                .Select(v => v.ValidateAsync(context, cancellationToken)).ToList();
            var failures = new List<ValidationFailure>();
            foreach (var validator in validators)
            {
                var validationResult = await validator;
                if (validationResult.Errors.Any()) failures.AddRange(validationResult.Errors);
            }

            if (failures.Count != 0) throw new ValidationException(failures);

            return await next();
        }
    }
}