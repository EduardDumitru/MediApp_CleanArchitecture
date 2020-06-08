using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
    public class Prescription : AuditableEntity
    {
        public Prescription()
        {
            PrescriptionXDrugs = new HashSet<PrescriptionXDrug>();
        }

        public long Id { get; set; }
        public int NoOfDays { get; set; }
        public string Description { get; set; }
        public long PatientId { get; set; }
        public long MedicalCheckId { get; set; }
        public long EmployeeId { get; set; }

        public MedicalCheck MedicalCheck { get; set; }

        public UserProfile UserProfile { get; set; }

        public Employee Employee { get; set; }

        public ICollection<PrescriptionXDrug> PrescriptionXDrugs { get; }
    }
}