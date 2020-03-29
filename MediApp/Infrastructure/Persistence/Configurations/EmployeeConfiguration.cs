using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {
            builder.ToTable(nameof(Employee));

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.HasOne(x => x.EmployeeType)
                .WithMany(x => x.Employees)
                .HasForeignKey(x => x.EmployeeTypeId);

            builder.HasOne(x => x.MedicalCheckType)
                .WithMany(x => x.Employees)
                .HasForeignKey(x => x.MedicalCheckTypeId);

            builder.HasOne(x => x.Clinic)
                .WithMany(x => x.Employees)
                .HasForeignKey(x => x.ClinicId);
        }
    }
}
