using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class EmployeeDetailsVm : IMapFrom<Employee>
    {
        public TimeSpan StartHour { get; set; }
        public TimeSpan EndHour { get; set; }
        public DateTime? TerminationDate { get; set; }
        public string Name { get; set; }
        public string Cnp { get; set; }
        public short EmployeeTypeId { get; set; }
        public short MedicalCheckTypeId { get; set; }
        public int ClinicId { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Employee, EmployeeDetailsVm>()
                .ForMember(d => d.Name,
                    opt => opt.MapFrom(s =>
                        s.UserProfile != null
                            ? s.UserProfile.GetFullName()
                            : string.Empty))
                .ForMember(d => d.Cnp,
                    opt => opt.MapFrom(s =>
                        s.UserProfile != null
                            ? s.UserProfile.CNP
                            : string.Empty));
        }
    }
}