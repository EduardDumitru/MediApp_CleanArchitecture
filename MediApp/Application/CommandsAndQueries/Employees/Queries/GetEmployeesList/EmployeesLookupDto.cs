using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class EmployeesLookupDto : IMapFrom<Employee>
    {
        public long Id { get; set; }
        public TimeSpan StartHour { get; set; }
        public TimeSpan EndHour { get; set; }
        public DateTime? TerminationDate { get; set; }
        public string Name { get; set; }
        public string Cnp { get; set; }
        public string EmployeeTypeName { get; set; }
        public string MedicalCheckTypeName { get; set; }
        public string ClinicName { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Employee, EmployeesLookupDto>()
                .ForMember(d => d.MedicalCheckTypeName,
                    opt => opt.MapFrom(s =>
                        s.MedicalCheckType != null
                            ? s.MedicalCheckType.Name
                            : string.Empty))
                .ForMember(d => d.ClinicName,
                    opt => opt.MapFrom(s =>
                        s.Clinic != null
                            ? s.Clinic.Name
                            : string.Empty))
                .ForMember(d => d.EmployeeTypeName,
                    opt => opt.MapFrom(s =>
                        s.EmployeeType != null
                            ? s.EmployeeType.Name
                            : string.Empty))
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