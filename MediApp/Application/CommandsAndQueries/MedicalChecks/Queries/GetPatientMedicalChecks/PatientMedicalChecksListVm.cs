using System.Collections.Generic;

namespace Application.CommandsAndQueries
{
    public class PatientMedicalChecksListVm
    {
        public IList<PatientMedicalChecksLookupDto> PatientMedicalChecks { get; set; }
    }
}