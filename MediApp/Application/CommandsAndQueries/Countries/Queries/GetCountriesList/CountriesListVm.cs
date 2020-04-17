using System;
using System.Collections.Generic;
using System.Text;
using Application.Common.Mappings;
using Domain.Entities;

namespace Application.CommandsAndQueries
{
    public class CountriesListVm
    { 
        public IList<CountriesLookupDto> Countries { get; set; }
    }
}
