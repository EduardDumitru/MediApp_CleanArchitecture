using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class DiagnosesLookupDto : IMapFrom<Diagnosis>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}