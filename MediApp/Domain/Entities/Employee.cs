using System;
using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
    public class Employee : AuditableEntity
    {
        public Employee()
        {
            HolidayIntervals = new HashSet<HolidayInterval>();
            MedicalChecks = new HashSet<MedicalCheck>();
            Prescriptions = new HashSet<Prescription>();
        }

        public long Id { get; set; }
        public TimeSpan StartHour { get; set; }
        public TimeSpan EndHour { get; set; }
        public DateTime? TerminationDate { get; set; }
        public long UserProfileId { get; set; }
        public short EmployeeTypeId { get; set; }
        public short? MedicalCheckTypeId { get; set; }
        public int ClinicId { get; set; }

        public EmployeeType EmployeeType { get; set; }
        public MedicalCheckType MedicalCheckType { get; set; }
        public Clinic Clinic { get; set; }
        public UserProfile UserProfile { get; set; }
        public ICollection<HolidayInterval> HolidayIntervals { get; }
        public ICollection<MedicalCheck> MedicalChecks { get; }
        public ICollection<Prescription> Prescriptions { get; }
    }
}