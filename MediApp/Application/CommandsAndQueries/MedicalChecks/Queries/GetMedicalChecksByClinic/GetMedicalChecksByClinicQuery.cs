using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetMedicalChecksByClinicQuery : IRequest<MedicalChecksByClinicListVm>
    {
        public int ClinicId { get; set; }
    }

    public class GetMedicalChecksByClinicQueryHandler
        : IRequestHandler<GetMedicalChecksByClinicQuery, MedicalChecksByClinicListVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetMedicalChecksByClinicQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MedicalChecksByClinicListVm> Handle(GetMedicalChecksByClinicQuery request,
            CancellationToken cancellationToken)
        {
            var medicalChecksByClinic = await _context.MedicalChecks
                .Where(x => x.ClinicId == request.ClinicId)
                .Include(x => x.UserProfile)
                .Include(x => x.Clinic)
                .Include(x => x.MedicalCheckType)
                .Include(x => x.Diagnosis)
                .Include(x => x.Employee).ThenInclude(x => x.UserProfile)
                .OrderByDescending(x => x.CreatedOn)
                .ProjectTo<MedicalChecksByClinicLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var vm = new MedicalChecksByClinicListVm()
            {
                MedicalChecksByClinic = medicalChecksByClinic
            };

            return vm;
        }
    }
}
