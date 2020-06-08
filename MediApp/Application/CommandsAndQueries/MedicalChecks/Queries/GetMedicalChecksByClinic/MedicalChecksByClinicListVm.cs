using System;
using System.Collections.Generic;
using System.Text;

namespace Application.CommandsAndQueries
{
    public class MedicalChecksByClinicListVm
    {
        public IList<MedicalChecksByClinicLookupDto> MedicalChecksByClinic { get; set; }
    }
}
