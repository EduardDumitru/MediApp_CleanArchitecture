using System;
using System.Collections.Generic;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class Country : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
