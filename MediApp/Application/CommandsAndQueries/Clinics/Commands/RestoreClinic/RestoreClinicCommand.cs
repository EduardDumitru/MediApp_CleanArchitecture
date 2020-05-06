using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreClinicCommand : IRequest<Result>
    {
        public int Id { get; set; }
    }

    public class RestoreClinicCommandHandler : IRequestHandler<RestoreClinicCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreClinicCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreClinicCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Clinics
                .Include(x => x.Country)
                .Include(x => x.County)
                .Include(x => x.City)
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded)
            {
                return validationResult;
            }

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Clinic was restored");
        }

        private Result Validations(Clinic entity)
        {
            var errors = new List<string>();

            if (entity == null)
            {
                return Result.Failure(new List<string> {"No valid clinic found"});
            }

            if (entity.Country == null || entity.Country != null && entity.Country.Deleted)
            {
                errors.Add("County is deleted. You must update that first.");
            }

            if (entity.County == null || entity.County != null && entity.County.Deleted)
            {
                errors.Add("Country is deleted. You must update that first.");
            }

            if (entity.City == null || entity.City != null && entity.City.Deleted)
            {
                errors.Add("City is deleted. You must update that first.");
            }

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}
