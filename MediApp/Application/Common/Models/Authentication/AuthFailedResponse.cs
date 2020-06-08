using System.Collections.Generic;

namespace Application.Common.Models.Authentication
{
    public class AuthFailedResponse
    {
        public IEnumerable<string> Errors { get; set; }
    }
}