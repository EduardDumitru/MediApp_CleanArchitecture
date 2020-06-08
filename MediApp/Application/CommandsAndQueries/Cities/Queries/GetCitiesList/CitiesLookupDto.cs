using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class CitiesLookupDto : IMapFrom<City>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CountyName { get; set; }
        public string CountryName { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<City, CitiesLookupDto>()
                .ForMember(d => d.CountyName,
                    opt => opt.MapFrom(s =>
                        s.County != null ? s.County.Name : string.Empty))
                .ForMember(d => d.CountryName,
                    opt => opt.MapFrom(s =>
                        s.County.Country != null ? s.County.Country.Name : string.Empty));
        }
    }
}