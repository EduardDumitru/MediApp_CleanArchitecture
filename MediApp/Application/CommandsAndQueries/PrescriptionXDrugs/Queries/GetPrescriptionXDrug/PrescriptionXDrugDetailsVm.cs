using System;
using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class PrescriptionXDrugDetailsVm : IMapFrom<PrescriptionXDrug>
    {
        public long PrescriptionId { get; set; }
        public long DrugId { get; set; }
        public short Box { get; set; }
        public float PerInterval { get; set; }
        public TimeSpan Interval { get; set; }
        public bool? Deleted { get; set; }
    }
}