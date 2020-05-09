using System;

namespace Application.CommandsAndQueries
{
    public class AddPrescriptionXDrugDto
    {
        public long DrugId { get; set; }
        public short Box { get; set; }
        public float PerInterval { get; set; }
        public TimeSpan Interval { get; set; }
    }
}