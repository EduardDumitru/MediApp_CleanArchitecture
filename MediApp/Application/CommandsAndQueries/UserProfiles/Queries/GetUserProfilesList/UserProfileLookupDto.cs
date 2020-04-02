using System;
using System.Collections.Generic;
using System.Text;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class UserProfileLookupDto : IMapFrom<UserProfile>
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNo { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailAddress { get; set; }
        public string CNP { get; set; }
        public string CountryName { get; set; }
        public string CountyName { get; set; }
        public string CityName { get; set; }
        public string GenderName { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<UserProfile, UserProfileLookupDto>()
                .ForMember(d => d.Name,
                    opt => opt.MapFrom(s =>
                        string.IsNullOrEmpty(s.MiddleName)
                            ? $"{s.FirstName} {s.LastName}"
                            : $"{s.FirstName} {s.MiddleName} {s.LastName}"))
                .ForMember(d => d.CountryName,
                    opt => opt.MapFrom(s =>
                        s.City.County.Country.Name))
                .ForMember(d => d.CountyName, 
                    opt => opt.MapFrom(s =>
                        s.City.County.Name))
                .ForMember(d => d.CityName, 
                    opt => opt.MapFrom(s =>
                        s.City.Name))
                .ForMember(d => d.GenderName, 
                    opt => opt.MapFrom(s =>
                        s.Gender.Name));
        }
    }
}
