using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class RestoreEmployeeCommand : IRequest<Result>
    {
        public long Id { get; set; }
    }

    public class RestoreEmployeeCommandHandler : IRequestHandler<RestoreEmployeeCommand, Result>
    {
        private readonly IApplicationDbContext _context;

        public RestoreEmployeeCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(RestoreEmployeeCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Employees
                .Include(x => x.UserProfile)
                .Include(x => x.Clinic)
                .Include(x => x.EmployeeType)
                .Include(x => x.MedicalCheckType)
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.Deleted, cancellationToken);

            var validationResult = Validations(entity);
            if (!validationResult.Succeeded) return validationResult;

            entity.Deleted = false;
            entity.DeletedBy = null;
            entity.DeletedOn = null;

            await _context.SaveChangesAsync(cancellationToken);

            return Result.Success("Employee was restored");
        }

        private Result Validations(Employee entity)
        {
            var errors = new List<string>();

            if (entity == null) return Result.Failure(new List<string> {"No valid employee found"});

            if (entity.UserProfile == null || entity.UserProfile != null && entity.UserProfile.Deleted)
                errors.Add("User profile is deleted. You must update that first.");

            if (entity.Clinic == null || entity.Clinic != null && entity.Clinic.Deleted)
                errors.Add("Clinic is deleted. You must update that first.");

            if (entity.EmployeeType == null || entity.EmployeeType != null && entity.EmployeeType.Deleted)
                errors.Add("Employee Type is deleted. You must update that first.");

            if (entity.MedicalCheckType == null || entity.MedicalCheckType != null && entity.MedicalCheckType.Deleted)
                errors.Add("Medical Check Type is deleted. You must update that first.");

            return errors.Any() ? Result.Failure(errors) : Result.Success();
        }
    }
}