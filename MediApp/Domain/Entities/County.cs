using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
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
        public ICollection<City> Cities { get; private set; }
        public ICollection<Clinic> Clinics { get; private set; }
        public ICollection<UserProfile> UserProfiles { get; private set; }
    }
}
