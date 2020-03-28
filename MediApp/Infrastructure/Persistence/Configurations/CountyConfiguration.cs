using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class CountyConfiguration : IEntityTypeConfiguration<County>
    {
        public void Configure(EntityTypeBuilder<County> builder)
        {
            builder.ToTable(nameof(County));

            builder.Property(x => x.Name)
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(x => x.CountryId)
                .IsRequired();

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.HasOne(x => x.Country)
                .WithMany(x => x.Counties)
                .HasForeignKey(x => x.CountryId);
        }
    }
}
