using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class UpdateClinicCommand : IRequest<Result>
    {
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
    }

    public class UpdateClinicCommandHandler : IRequestHandler<UpdateClinicCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public UpdateClinicCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(UpdateClinicCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Clinics
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.Deleted, cancellationToken);

            if (entity == null) return Result.Failure(new List<string> {"No valid clinic found"});

            entity.Name = request.Name;
            entity.Email = request.Email;
            entity.Address = request.Address;
            entity.StreetNo = request.StreetNo;
            entity.StreetName = request.StreetName;
            entity.PhoneNumber = request.PhoneNumber;
            entity.CountryId = request.CountryId;
            entity.CountyId = request.CountyId;
            entity.CityId = request.CityId;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Clinic update was successful");
        }
    }
}