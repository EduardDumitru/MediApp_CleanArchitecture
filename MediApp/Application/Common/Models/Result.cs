using System.Collections.Generic;
using System.Linq;

namespace Application.Common.Models
{
    public class Result
    {
        public Result()
        {
        }

        private Result(bool succeeded, IEnumerable<string> errors)
        {
            Succeeded = succeeded;
            Errors = errors.ToArray();
            SuccessMessage = "";
        }

        private Result(bool succeeded, string successMessage)
        {
            Succeeded = succeeded;
            SuccessMessage = successMessage;
        }

        public bool Succeeded { get; }

        public string SuccessMessage { get; }

        public string[] Errors { get; }

        public static Result Success()
        {
            return new Result(true, new string[] { });
        }

        public static Result Success(string successMessage)
        {
            return new Result(true, successMessage);
        }

        public static Result Failure(IEnumerable<string> errors)
        {
            return new Result(false, errors);
        }
    }
}