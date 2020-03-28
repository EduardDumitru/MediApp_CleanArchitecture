using System;
using System.Collections.Generic;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class Country : AuditableEntity
    {
        public Country()
        {
            Counties = new HashSet<County>();
            Clinics = new HashSet<Clinic>();
        }
        public short Id { get; set; }
        public string Name { get; set; }

        public ICollection<County> Counties { get; private set; }
        public ICollection<Clinic> Clinics { get; private set; }
    }
}
