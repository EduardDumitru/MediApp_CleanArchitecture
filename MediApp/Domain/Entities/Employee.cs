using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class Employee : AuditableEntity
    {
        public Employee()
        {
            HolidayIntervals = new HashSet<HolidayInterval>();
            MedicalChecks = new HashSet<MedicalCheck>();
        }
        public long Id { get; set; }
        public TimeSpan StartHour { get; set; }
        public TimeSpan EndHour { get; set; }
        public DateTime? TerminationDate { get; set; }
        public long UserId { get; set; }
        public short EmployeeTypeId { get; set; }
        public short? MedicalCheckTypeId { get; set; }
        public int ClinicId { get; set; }

        public EmployeeType EmployeeType { get; set; }
        public MedicalCheckType MedicalCheckType { get; set; }
        public Clinic Clinic { get; set; }
        public ICollection<HolidayInterval> HolidayIntervals { get; private set; }
        public ICollection<MedicalCheck> MedicalChecks { get; private set; }
    }
}
