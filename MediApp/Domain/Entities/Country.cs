using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
    public class Country : AuditableEntity
    {
        public Country()
        {
            Counties = new HashSet<County>();
            Clinics = new HashSet<Clinic>();
            UserProfiles = new HashSet<UserProfile>();
        }

        public short Id { get; set; }
        public string Name { get; set; }

        public ICollection<County> Counties { get; }
        public ICollection<Clinic> Clinics { get; }
        public ICollection<UserProfile> UserProfiles { get; }
    }
}