using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {

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
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        public DatabaseFacade Database { get; }
    }
}
