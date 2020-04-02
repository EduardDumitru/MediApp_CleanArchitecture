using System;
using System.Collections.Generic;
using System.Text;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class UserProfileDetailVm : IMapFrom<UserProfile>
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNo { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailAddress { get; set; }
        public string CNP { get; set; }
        public short CountryId { get; set; }
        public int CountyId { get; set; }
        public int CityId { get; set; }
        public short GenderId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<UserProfile, UserProfileDetailVm>()
                .ForMember(d => d.MiddleName,
                    opt => opt.MapFrom(s => 
                        string.IsNullOrEmpty(s.MiddleName) ? "" : s.MiddleName))
                .ForMember(d => d.Address,
                    opt => opt.MapFrom(s => 
                        string.IsNullOrEmpty(s.Address) ? "" : s.Address))
                .ForMember(d => d.StreetName,
                    opt => opt.MapFrom(s => 
                        string.IsNullOrEmpty(s.StreetName) ? "" : s.StreetName));


        }
    }
}
