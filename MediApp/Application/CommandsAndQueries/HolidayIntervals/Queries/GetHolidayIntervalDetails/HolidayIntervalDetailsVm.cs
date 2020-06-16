using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class HolidayIntervalDetailsVm : IMapFrom<HolidayInterval>
    {
        public long EmployeeId { get; set; }
        public long? UserProfileId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<HolidayInterval, HolidayIntervalDetailsVm>()
                .ForMember(d => d.UserProfileId,
                    opt => opt.MapFrom(s =>
                        s.Employee != null
                            ? s.Employee.UserProfileId : (long?) null));
        }
    }
}