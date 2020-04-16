using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;

namespace Application.CommandsAndQueries
{
    public class AddClinicCommand : IRequest<Result>
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
    }

    public class AddClinicCommandHandler : IRequestHandler<AddClinicCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public AddClinicCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(AddClinicCommand request, CancellationToken cancellationToken)
        {
            var entity = new Clinic
            {
                Name = request.Name,
                Address = request.Address,
                StreetName = request.StreetName,
                StreetNo = request.StreetNo,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                CountryId = request.CountryId,
                CountyId = request.CountyId,
                CityId = request.CityId
            };

            await _context.Clinics.AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Clinic was created successfully");
        }
    }
}
