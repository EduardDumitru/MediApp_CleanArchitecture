using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Users.Commands.AddUser
{
    public class AddUserCommand
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNo { get; set; }
        public string CNP { get; set; }
        public string PhoneNumber { get; set; }
        public short CountryId { get; set; }
        public int CountyId { get; set; }
        public int CityId { get; set; }
        public short GenderId { get; set; }
    }
}
