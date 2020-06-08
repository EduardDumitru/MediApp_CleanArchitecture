using System;
using System.Collections.Generic;
using System.Text;

namespace Application.CommandsAndQueries
{
    public class PrescriptionsByMedicalCheckListVm
    {
        public IList<PrescriptionsByMedicalCheckLookupDto> PrescriptionsByMedicalCheck { get; set; }
    }
}
