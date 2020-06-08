using System.Collections.Generic;

namespace Application.CommandsAndQueries
{
    public class UserProfileListVm
    {
        public IList<UserProfileLookupDto> UserProfiles { get; set; }
    }
}