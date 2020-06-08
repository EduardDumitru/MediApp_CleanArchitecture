using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
    public class Drug : AuditableEntity
    {
        public Drug()
        {
            DiagnosisXDrugs = new HashSet<DiagnosisXDrug>();
            PrescriptionXDrugs = new HashSet<PrescriptionXDrug>();
        }

        public long Id { get; set; }
        public string Name { get; set; }

        public ICollection<DiagnosisXDrug> DiagnosisXDrugs { get; }
        public ICollection<PrescriptionXDrug> PrescriptionXDrugs { get; }
    }
}