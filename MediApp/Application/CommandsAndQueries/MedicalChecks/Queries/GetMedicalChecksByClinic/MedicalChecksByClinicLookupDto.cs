using System;
using System.Collections.Generic;
using System.Text;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class MedicalChecksByClinicLookupDto : IMapFrom<MedicalCheck>
    {
        public long Id { get; set; }
        public DateTime Appointment { get; set; }
        public string ClinicName { get; set; }
        public string DiagnosisName { get; set; }
        public string EmployeeName { get; set; }
        public string PatientName { get; set; }
        public string PatientCnp { get; set; }
        public string MedicalCheckTypeName { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<MedicalCheck, MedicalChecksByClinicLookupDto>()
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
                .ForMember(d => d.DiagnosisName,
                    opt => opt.MapFrom(s =>
                        s.Diagnosis != null
                            ? s.Diagnosis.Name
                            : string.Empty))
                .ForMember(d => d.PatientName,
                    opt => opt.MapFrom(s =>
                        s.UserProfile != null
                            ? s.UserProfile.GetFullName()
                            : string.Empty))
                .ForMember(d => d.PatientCnp,
                    opt => opt.MapFrom(s =>
                        s.UserProfile != null
                            ? s.UserProfile.CNP
                            : string.Empty))
                .ForMember(d => d.EmployeeName,
                    opt => opt.MapFrom(s =>
                        s.Employee != null
                            ? (s.Employee.UserProfile != null
                                ? s.Employee.UserProfile.GetFullName()
                                : string.Empty)
                            : string.Empty));
        }
    }
}
