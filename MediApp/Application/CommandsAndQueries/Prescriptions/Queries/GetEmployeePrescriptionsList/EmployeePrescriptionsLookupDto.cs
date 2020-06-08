using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class EmployeePrescriptionsLookupDto : IMapFrom<Prescription>
    {
        public long Id { get; set; }
        public int NoOfDays { get; set; }
        public string Description { get; set; }
        public long MedicalCheckId { get; set; }
        public string MedicalCheckTypeName { get; set; }
        public string ClinicName { get; set; }
        public string PatientName { get; set; }
        public string DiagnosisName { get; set; }
        public bool? Deleted { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Prescription, EmployeePrescriptionsLookupDto>()
                .ForMember(d => d.MedicalCheckTypeName,
                    opt => opt.MapFrom(s =>
                        s.MedicalCheck != null
                            ? s.MedicalCheck.MedicalCheckType != null
                                ? s.MedicalCheck.MedicalCheckType.Name
                                : string.Empty
                            : string.Empty))
                .ForMember(d => d.ClinicName,
                    opt => opt.MapFrom(s =>
                        s.MedicalCheck != null
                            ? s.MedicalCheck.Clinic != null
                                ? s.MedicalCheck.Clinic.Name
                                : string.Empty
                            : string.Empty))
                .ForMember(d => d.DiagnosisName,
                    opt => opt.MapFrom(s =>
                        s.MedicalCheck != null
                            ? s.MedicalCheck.Diagnosis != null
                                ? s.MedicalCheck.Diagnosis.Name
                                : string.Empty
                            : string.Empty))
                .ForMember(d => d.PatientName,
                    opt => opt.MapFrom(s =>
                        s.UserProfile != null
                            ? s.UserProfile.GetFullName()
                            : string.Empty));
        }
    }
}