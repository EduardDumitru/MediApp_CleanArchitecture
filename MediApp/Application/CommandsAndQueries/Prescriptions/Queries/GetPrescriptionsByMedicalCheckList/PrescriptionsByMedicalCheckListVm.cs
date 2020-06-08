using System.Collections.Generic;

namespace Application.CommandsAndQueries
{
    public class PrescriptionsByMedicalCheckListVm
    {
        public IList<PrescriptionsByMedicalCheckLookupDto> PrescriptionsByMedicalCheck { get; set; }
    }
}