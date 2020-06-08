using System.Collections.Generic;

namespace Application.CommandsAndQueries
{
    public class MedicalChecksByClinicListVm
    {
        public IList<MedicalChecksByClinicLookupDto> MedicalChecksByClinic { get; set; }
    }
}