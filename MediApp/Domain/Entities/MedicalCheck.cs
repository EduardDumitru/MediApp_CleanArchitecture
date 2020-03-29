using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class MedicalCheck : AuditableEntity
    {
        public MedicalCheck()
        {
            Prescriptions = new HashSet<Prescription>();
        }

        public long Id { get; set; }
        public DateTime Appointment { get; set; }
        public int ClinicId { get; set; }
        public int? DiagnosisId { get; set; }
        public long EmployeeId { get; set; }
        public long PatientId { get; set; }
        public short MedicalCheckTypeId { get; set; }

        public Employee Employee { get; set; }

        public MedicalCheckType MedicalCheckType { get; set; }

        public Clinic Clinic { get; set; }
        
        public Diagnosis Diagnosis { get; set; }

        public ICollection<Prescription> Prescriptions { get; private set; }
    }
}
