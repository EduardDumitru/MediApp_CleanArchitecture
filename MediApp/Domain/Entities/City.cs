using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class City : AuditableEntity
    {
        public City()
        {
            Clinics = new HashSet<Clinic>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public int CountyId { get; set; }

        public County County { get; set; }
        public ICollection<Clinic> Clinics { get; private set; }
    }
}
