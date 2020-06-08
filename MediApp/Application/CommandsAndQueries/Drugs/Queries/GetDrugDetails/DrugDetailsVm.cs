using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class DrugDetailsVm : IMapFrom<Drug>
    {
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}