using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
    public class City : AuditableEntity
    {
        public City()
        {
            Clinics = new HashSet<Clinic>();
            UserProfiles = new HashSet<UserProfile>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int CountyId { get; set; }

        public County County { get; set; }
        public ICollection<Clinic> Clinics { get; }
        public ICollection<UserProfile> UserProfiles { get; }
    }
}