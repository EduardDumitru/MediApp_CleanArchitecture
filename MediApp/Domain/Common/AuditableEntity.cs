using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Common
{
    public class AuditableEntity
    {

        public long CreatedBy { get; set; }

        public DateTime CreatedOn { get; set; }

        public long? LastModifiedBy { get; set; }

        public DateTime? LastModifiedOn { get; set; }

        public bool Deleted { get; set; }

        public long? DeletedBy { get; set; }

        public DateTime? DeletedOn { get; set; }
    }
}
