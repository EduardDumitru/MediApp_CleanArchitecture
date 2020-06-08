using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
    public class EmployeeType : AuditableEntity
    {
        public EmployeeType()
        {
            Employees = new HashSet<Employee>();
        }

        public short Id { get; set; }
        public string Name { get; set; }

        public ICollection<Employee> Employees { get; }
    }
}