using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class City : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CountyId { get; set; }

        [ForeignKey(nameof(CountyId))]
        public County County { get; set; }
    }
}
