using System;
using System.Collections.Generic;
using System.Text;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class GenderDetailsVm : IMapFrom<Gender>
    {
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}
