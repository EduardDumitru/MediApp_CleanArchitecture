using System;
using Domain.Common;

namespace Domain.Entities
{
    public class HolidayInterval : AuditableEntity
    {
        public long Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public long EmployeeId { get; set; }

        public Employee Employee { get; set; }
    }
}