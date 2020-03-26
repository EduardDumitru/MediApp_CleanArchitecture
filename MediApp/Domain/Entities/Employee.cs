using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class Employee : AuditableEntity
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public int EmployeeTypeId { get; set; }
        public DateTime TerminationDate { get; set; }
        // [ForeignKey(nameof(UserId))] 
        // public ApplicationUser ApplicationUser { get; set; }
    }
}
