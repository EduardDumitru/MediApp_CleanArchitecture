using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
    public class Gender : AuditableEntity
    {
        public Gender()
        {
            UserProfiles = new HashSet<UserProfile>();
        }

        public short Id { get; set; }
        public string Name { get; set; }
        public ICollection<UserProfile> UserProfiles { get; }
    }
}