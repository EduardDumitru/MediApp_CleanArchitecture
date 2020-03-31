using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class MedicalCheckConfiguration : IEntityTypeConfiguration<MedicalCheck>
    {
        public void Configure(EntityTypeBuilder<MedicalCheck> builder)
        {
            builder.ToTable(nameof(MedicalCheck));

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.HasOne(x => x.Employee)
                .WithMany(x => x.MedicalChecks)
                .HasForeignKey(x => x.EmployeeId);

            builder.HasOne(x => x.MedicalCheckType)
                .WithMany(x => x.MedicalChecks)
                .HasForeignKey(x => x.MedicalCheckTypeId);

            builder.HasOne(x => x.Clinic)
                .WithMany(x => x.MedicalChecks)
                .HasForeignKey(x => x.ClinicId);

            builder.HasOne(x => x.Diagnosis)
                .WithMany(x => x.MedicalChecks)
                .HasForeignKey(x => x.DiagnosisId);

            builder.HasOne(x => x.UserProfile)
                .WithMany(x => x.MedicalChecks)
                .HasForeignKey(x => x.PatientId);
        }
    }
}
