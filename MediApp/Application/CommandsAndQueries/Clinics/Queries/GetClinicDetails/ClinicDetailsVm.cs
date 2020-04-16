using System;
using System.Collections.Generic;
using System.Text;
using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class ClinicDetailsVm : IMapFrom<Clinic>
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNo { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public short CountryId { get; set; }
        public int CountyId { get; set; }
        public int CityId { get; set; }
        public bool? Deleted { get; set; }
    }
}
