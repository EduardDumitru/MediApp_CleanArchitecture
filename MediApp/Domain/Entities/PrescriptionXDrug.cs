using System;
using Domain.Common;

namespace Domain.Entities
{
    public class PrescriptionXDrug : AuditableEntity
    {
        public long Id { get; set; }
        public long PrescriptionId { get; set; }
        public long DrugId { get; set; }
        public short Box { get; set; }
        public float PerInterval { get; set; }
        public TimeSpan Interval { get; set; }

        public Prescription Prescription { get; set; }

        public Drug Drug { get; set; }
    }
}