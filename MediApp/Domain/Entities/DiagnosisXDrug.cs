using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Domain.Common;

namespace Domain.Entities
{
    public class DiagnosisXDrug : AuditableEntity
    {
        public long Id { get; set; }
        public int DiagnosisId { get; set; }
        public long DrugId { get; set; }

        public Diagnosis Diagnosis { get; set; }
        public Drug Drug { get; set; }
    }
}
