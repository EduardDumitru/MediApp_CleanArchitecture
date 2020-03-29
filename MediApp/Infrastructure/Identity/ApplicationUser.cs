using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser<long>
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNo { get; set; }
        public string CNP { get; set; }
        public bool? IsActive { get; set; }
        public short CountryId { get; set; }
        public int CountyId { get; set; }
        public int CityId { get; set; }
        public short GenderId { get; set; }

        [ForeignKey(nameof(CountryId))]
        public Country Country { get; set; }

        [ForeignKey(nameof(CountyId))]
        public County County { get; set; }

        [ForeignKey(nameof(CityId))]
        public City City { get; set; }

        [ForeignKey(nameof(GenderId))]
        public Gender Gender { get; set; }
    }
}
