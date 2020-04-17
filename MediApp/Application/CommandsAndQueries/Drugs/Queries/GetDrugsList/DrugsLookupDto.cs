using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class DrugsLookupDto : IMapFrom<Drug>
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}