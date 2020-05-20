using System;
using System.Collections.Generic;
using System.Text;
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
