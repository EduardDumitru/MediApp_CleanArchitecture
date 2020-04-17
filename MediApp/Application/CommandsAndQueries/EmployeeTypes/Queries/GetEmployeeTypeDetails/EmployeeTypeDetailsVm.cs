using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class EmployeeTypeDetailsVm : IMapFrom<EmployeeType>
    {
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}