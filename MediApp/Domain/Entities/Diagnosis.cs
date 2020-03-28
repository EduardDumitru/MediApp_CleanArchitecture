using System;
using System.Collections.Generic;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class Diagnosis : AuditableEntity
    {
        public Diagnosis()
        {
            DiagnosisXDrugs = new HashSet<DiagnosisXDrug>();
            MedicalChecks = new HashSet<MedicalCheck>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<DiagnosisXDrug> DiagnosisXDrugs { get; private set; }
        public ICollection<MedicalCheck> MedicalChecks { get; private set; }
    }
}
