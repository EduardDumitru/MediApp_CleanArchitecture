using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
    public class County : AuditableEntity
    {
        public County()
        {
            Cities = new HashSet<City>();
            Clinics = new HashSet<Clinic>();
            UserProfiles = new HashSet<UserProfile>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public short CountryId { get; set; }

        public Country Country { get; set; }
        public ICollection<City> Cities { get; }
        public ICollection<Clinic> Clinics { get; }
        public ICollection<UserProfile> UserProfiles { get; }
    }
}