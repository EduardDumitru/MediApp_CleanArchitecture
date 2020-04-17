using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class MedicalCheckTypeDetailsVm : IMapFrom<MedicalCheckType>
    {
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}