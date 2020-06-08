using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Common;

namespace Domain.Entities
{
    public class UserProfile : AuditableEntity
    {
        public UserProfile()
        {
            MedicalChecks = new HashSet<MedicalCheck>();
            Prescriptions = new HashSet<Prescription>();
            Employees = new HashSet<Employee>();
        }

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
        public long UserId { get; set; }

        [ForeignKey(nameof(CountryId))] public Country Country { get; set; }

        [ForeignKey(nameof(CountyId))] public County County { get; set; }

        [ForeignKey(nameof(CityId))] public City City { get; set; }

        [ForeignKey(nameof(GenderId))] public Gender Gender { get; set; }

        public ICollection<MedicalCheck> MedicalChecks { get; }
        public ICollection<Employee> Employees { get; }
        public ICollection<Prescription> Prescriptions { get; }

        public string GetFullName()
        {
            if (string.IsNullOrWhiteSpace(MiddleName)) return FirstName + " " + LastName;

            return FirstName + " " + MiddleName + " " + LastName;
        }
    }
}