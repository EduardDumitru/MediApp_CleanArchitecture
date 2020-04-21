using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class DiagnosisXDrugsLookupDto : IMapFrom<DiagnosisXDrug>
    {
        public long Id { get; set; }
        public string DiagnosisName { get; set; }
        public string DrugName { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<DiagnosisXDrug, DiagnosisXDrugsLookupDto>()
                .ForMember(d => d.DiagnosisName,
                    opt => opt.MapFrom(s =>
                        s.Diagnosis != null ? s.Diagnosis.Name : string.Empty))
                .ForMember(d => d.DrugName,
                    opt => opt.MapFrom(s =>
                        s.Drug != null ? s.Drug.Name : string.Empty));
        }
    }
}