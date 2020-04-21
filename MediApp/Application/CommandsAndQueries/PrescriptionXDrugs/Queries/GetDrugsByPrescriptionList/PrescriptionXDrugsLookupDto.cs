using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class PrescriptionXDrugsLookupDto : IMapFrom<PrescriptionXDrug>
    {
        public long Id { get; set; }
        public string DrugName { get; set; }
        public short Box { get; set; }
        public float PerInterval { get; set; }
        public TimeSpan Interval { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<PrescriptionXDrug, PrescriptionXDrugsLookupDto>()
                .ForMember(d => d.DrugName,
                    opt => opt.MapFrom(s =>
                        s.Drug != null ? s.Drug.Name : string.Empty));
        }
    }
}