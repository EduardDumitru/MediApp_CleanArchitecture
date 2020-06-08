using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class CountyDetailsVm : IMapFrom<County>
    {
        public string Name { get; set; }
        public short CountryId { get; set; }
        public bool? Deleted { get; set; }
    }
}