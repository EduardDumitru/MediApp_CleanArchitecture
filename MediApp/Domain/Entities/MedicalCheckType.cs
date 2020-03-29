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
            Employees = new HashSet<Employee>();
        }
        public short Id { get; set; }
        public string Name { get; set; }

        public ICollection<MedicalCheck> MedicalChecks { get; private set; }
        public ICollection<Employee> Employees { get; private set; }
    }
}
