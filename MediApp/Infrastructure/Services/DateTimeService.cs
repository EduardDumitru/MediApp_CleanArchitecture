using System;
using System.Collections.Generic;
using System.Text;
using Application.Common.Interfaces;

namespace Infrastructure.Services
{
    public class DateTimeService : IDateTime
    {
        public DateTime Now => DateTime.Now;
    }
}
