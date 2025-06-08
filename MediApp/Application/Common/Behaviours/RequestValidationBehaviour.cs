using FluentValidation;
using FluentValidation.Results;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ValidationException = Application.Common.Exceptions.ValidationException;

namespace Application.Common.Behaviours
{
    public class RequestValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators) : IPipelineBehavior<TRequest, TResponse>
           where TRequest : IRequest<TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators = validators;

        public async Task<TResponse> Handle(TRequest request,
            RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            // Fix: Specify the generic type argument for ValidationContext<T>
            var context = new ValidationContext<TRequest>(request);

            var validators = _validators
                .Select(v => v.ValidateAsync(context, cancellationToken)).ToList();
            var failures = new List<ValidationFailure>();
            foreach (var validator in validators)
            {
                var validationResult = await validator;
                if (validationResult.Errors.Count != 0) failures.AddRange(validationResult.Errors);
            }

            if (failures.Count != 0) throw new ValidationException(failures);

            return await next(cancellationToken);
        }
    }
}