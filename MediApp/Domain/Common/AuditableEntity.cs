using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Common
{
    public class AuditableEntity
    {
        public long CreatedBy { get; set; }

        public DateTime Created { get; set; }

        public long LastModifiedBy { get; set; }

        public DateTime? LastModified { get; set; }
    }
}
