using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class County : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CountryId { get; set; }
        [ForeignKey(nameof(CountryId))]
        public Country Country { get; set; }
    }
}
