using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CommandsAndQueries
{
    public class GetEmployeeDetailsByCurrentUserQuery : IRequest<EmployeeDetailsVm>
    {
    }

    public class
        GetEmployeeDetailsByCurrentUserQueryHandler : IRequestHandler<GetEmployeeDetailsByCurrentUserQuery, EmployeeDetailsVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public GetEmployeeDetailsByCurrentUserQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<EmployeeDetailsVm> Handle(GetEmployeeDetailsByCurrentUserQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Employees
                .Include(x => x.UserProfile)
                .FirstOrDefaultAsync(x => x.UserProfile.UserId == _currentUserService.UserId && !x.Deleted, cancellationToken);

            return entity == null ? null : _mapper.Map<EmployeeDetailsVm>(entity);
        }
    }
}
