using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class CityDetailsVm : IMapFrom<City>
    {
        public string Name { get; set; }
        public int CountyId { get; set; }
        public bool? Deleted { get; set; }
    }
}