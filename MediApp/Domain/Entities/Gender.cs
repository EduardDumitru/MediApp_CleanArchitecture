using System;
using System.Collections.Generic;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class Gender : AuditableEntity
    {
        public byte Id { get; set; }
        public string Name { get; set; }
    }
}
