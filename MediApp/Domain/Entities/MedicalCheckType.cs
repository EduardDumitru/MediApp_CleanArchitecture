using System;
using System.Collections.Generic;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class MedicalCheckType : AuditableEntity
    {
        public MedicalCheckType()
        {
            MedicalChecks = new HashSet<MedicalCheck>();
        }
        public short Id { get; set; }
        public string Name { get; set; }

        public ICollection<MedicalCheck> MedicalChecks { get; private set; }
    }
}
