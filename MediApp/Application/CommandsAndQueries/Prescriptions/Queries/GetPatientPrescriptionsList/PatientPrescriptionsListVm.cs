using System.Collections.Generic;

namespace Application.CommandsAndQueries
{
    public class PatientPrescriptionsListVm
    {
        public IList<PatientPrescriptionsLookupDto> PatientPrescriptions { get; set; }
    }
}