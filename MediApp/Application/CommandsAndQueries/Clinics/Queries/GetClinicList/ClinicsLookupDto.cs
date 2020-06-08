using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class ClinicsLookupDto : IMapFrom<Clinic>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CountryName { get; set; }
        public string CountyName { get; set; }
        public string CityName { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Clinic, ClinicsLookupDto>()
                .ForMember(d => d.CountryName,
                    opt => opt.MapFrom(s =>
                        s.Country != null ? s.Country.Name : string.Empty))
                .ForMember(d => d.CountyName,
                    opt => opt.MapFrom(s =>
                        s.County != null ? s.County.Name : string.Empty))
                .ForMember(d => d.CityName,
                    opt => opt.MapFrom(s =>
                        s.City != null ? s.City.Name : string.Empty));
        }
    }
}