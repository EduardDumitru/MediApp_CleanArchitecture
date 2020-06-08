using System;

namespace Application.CommandsAndQueries
{
    public class MedicalChecksToAddLookupDto
    {
        public DateTime Appointment { get; set; }
        public int ClinicId { get; set; }
        public string ClinicName { get; set; }
        public long EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public short MedicalCheckTypeId { get; set; }
        public string MedicalCheckTypeName { get; set; }
    }
}