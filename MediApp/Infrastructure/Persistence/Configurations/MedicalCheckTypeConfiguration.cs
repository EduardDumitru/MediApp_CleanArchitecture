using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class MedicalCheckTypeConfiguration : IEntityTypeConfiguration<MedicalCheckType>
    {
        public void Configure(EntityTypeBuilder<MedicalCheckType> builder)
        {
            builder.ToTable(nameof(MedicalCheckType));

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.Property(x => x.Name)
                .HasMaxLength(150)
                .IsRequired();

            builder.HasIndex(x => x.Name)
                .IsUnique();
        }
    }
}
