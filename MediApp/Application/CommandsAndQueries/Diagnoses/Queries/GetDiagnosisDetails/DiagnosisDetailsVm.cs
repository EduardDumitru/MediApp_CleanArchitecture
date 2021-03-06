﻿using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class DiagnosisDetailsVm : IMapFrom<Diagnosis>
    {
        public string Name { get; set; }
        public bool? Deleted { get; set; }
    }
}