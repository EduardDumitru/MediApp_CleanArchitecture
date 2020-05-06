using System.Collections.Generic;

namespace Application.CommandsAndQueries
{
    public class EmployeesListVm
    {
        public IList<EmployeesLookupDto> Employees { get; set; }
    }
}