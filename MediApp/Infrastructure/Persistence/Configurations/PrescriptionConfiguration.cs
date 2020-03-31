using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
    {
        public void Configure(EntityTypeBuilder<Prescription> builder)
        {
            builder.ToTable(nameof(Prescription));

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.Property(x => x.Description)
                .IsRequired();

            builder.HasOne(x => x.MedicalCheck)
                .WithMany(x => x.Prescriptions)
                .HasForeignKey(x => x.MedicalCheckId);

            builder.HasOne(x => x.UserProfile)
                .WithMany(x => x.Prescriptions)
                .HasForeignKey(x => x.PatientId);

            builder.HasOne(x => x.Employee)
                .WithMany(x => x.Prescriptions)
                .HasForeignKey(x => x.EmployeeId);
        }
    }
}
