using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, long>, IApplicationDbContext
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IDateTime _dateTime;

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public ApplicationDbContext(DbContextOptions options, ICurrentUserService currentUserService,
            IDateTime dateTime)
            : base(options)
        {
            _currentUserService = currentUserService;
            _dateTime = dateTime;
        }

        public DbSet<City> Cities { get; set; }
        public DbSet<Clinic> Clinics { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<County> Counties { get; set; }
        public DbSet<Diagnosis> Diagnoses { get; set; }
        public DbSet<DiagnosisXDrug> DiagnosisXDrugs { get; set; }
        public DbSet<Drug> Drugs { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeType> EmployeeTypes { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<HolidayInterval> HolidayIntervals { get; set; }
        public DbSet<MedicalCheck> MedicalChecks { get; set; }
        public DbSet<MedicalCheckType> MedicalCheckTypes { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescriptionXDrug> PrescriptionXDrugs { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedBy = _currentUserService.UserId;
                        entry.Entity.CreatedOn = _dateTime.Now;
                        break;

                    case EntityState.Modified:
                        if (entry.Entity.Deleted)
                        {
                            entry.Entity.DeletedBy = _currentUserService.UserId;
                            entry.Entity.DeletedOn = _dateTime.Now;
                        }
                        else
                        {
                            entry.Entity.LastModifiedBy = _currentUserService.UserId;
                            entry.Entity.LastModifiedOn = _dateTime.Now;
                        }

                        break;
                }

            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Model.GetEntityTypes().ToList().ForEach(entityType => entityType.GetForeignKeys()
                .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade)
                .ToList()
                .ForEach(fk => fk.DeleteBehavior = DeleteBehavior.Restrict));

            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}