﻿using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class EmployeeTypesLookupDto : IMapFrom<EmployeeType>
    {
        public short Id { get; set; }
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}