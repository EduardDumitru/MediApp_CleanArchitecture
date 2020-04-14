using System;
using System.Collections.Generic;
using System.Text;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class CountiesLookupDto : IMapFrom<County>
    {
        public short Id { get; set; }
        public string Name { get; set; }
        public string CountryName { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<County, CountiesLookupDto>()
                .ForMember(d => d.CountryName,
                    opt => opt.MapFrom(s =>
                        s.Country != null ? s.Country.Name : string.Empty));
        }
    }
}
