using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class HolidayIntervalsLookupDto : IMapFrom<HolidayInterval>
    {
        public long Id { get; set; }
        public string EmployeeName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<HolidayInterval, HolidayIntervalsLookupDto>()
                .ForMember(d => d.EmployeeName,
                    opt => opt.MapFrom(s =>
                        s.Employee != null ? 
                            s.Employee.UserProfile != null ? s.Employee.UserProfile.GetFullName() : string.Empty
                            : string.Empty));
        }
    }
}