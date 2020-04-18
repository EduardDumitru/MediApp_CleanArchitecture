using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class HolidayIntervalDetailsVm : IMapFrom<HolidayInterval>
    {
        public string Name { get; set; }
        public string EmployeeName { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<HolidayInterval, HolidayIntervalDetailsVm>()
                .ForMember(d => d.EmployeeName,
                    opt => opt.MapFrom(s =>
                        s.Employee != null
                            ? s.Employee.UserProfile != null ? s.Employee.UserProfile.GetFullName() : string.Empty
                            : string.Empty));
        }
    }
}