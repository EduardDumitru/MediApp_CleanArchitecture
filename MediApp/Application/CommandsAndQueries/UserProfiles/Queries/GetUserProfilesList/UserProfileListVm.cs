using System;
using System.Collections.Generic;
using System.Text;

namespace Application.CommandsAndQueries.UserProfiles.Queries.GetUserProfilesList
{
    public class UserProfileListVm
    {
        public IList<UserProfileLookupDto> UserProfiles { get; set; }
    }
}
