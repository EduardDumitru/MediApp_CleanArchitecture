﻿using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
    public class Clinic : AuditableEntity
    {
        public Clinic()
        {
            MedicalChecks = new HashSet<MedicalCheck>();
            Employees = new HashSet<Employee>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNo { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public short CountryId { get; set; }
        public int CountyId { get; set; }
        public int CityId { get; set; }


        public Country Country { get; set; }
        public County County { get; set; }
        public City City { get; set; }

        public ICollection<MedicalCheck> MedicalChecks { get; }
        public ICollection<Employee> Employees { get; }
    }
}