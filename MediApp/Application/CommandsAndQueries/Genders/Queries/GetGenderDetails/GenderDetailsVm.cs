using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class GenderDetailsVm : IMapFrom<Gender>
    {
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}