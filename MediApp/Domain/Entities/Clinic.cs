using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class Clinic : AuditableEntity
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int CountryId { get; set; }
        public int CountyId { get; set; }
        public int CityId { get; set; }
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNo { get; set; }
        [ForeignKey(nameof(CountryId))] 
        public Country Country { get; set; }

        [ForeignKey(nameof(CountyId))] 
        public County County { get; set; }

        [ForeignKey(nameof(CityId))] 
        public City City { get; set; }
    }
}
