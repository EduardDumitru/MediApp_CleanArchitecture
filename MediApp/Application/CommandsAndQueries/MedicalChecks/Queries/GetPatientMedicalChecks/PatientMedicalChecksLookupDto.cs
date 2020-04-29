using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class PatientMedicalChecksLookupDto : IMapFrom<MedicalCheck>
    {
        public long Id { get; set; }
        public DateTime Appointment { get; set; }
        public string ClinicName { get; set; }
        public string DiagnosisName { get; set; }
        public string EmployeeName { get; set; }
        public string MedicalCheckTypeName { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<MedicalCheck, PatientMedicalChecksLookupDto>()
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