using System;
using System.Collections.Generic;
using System.Text;

namespace Application.CommandsAndQueries
{
    public class DiagnosesLookupDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}
