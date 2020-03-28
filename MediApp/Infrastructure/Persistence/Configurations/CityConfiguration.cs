using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class CityConfiguration : IEntityTypeConfiguration<City>
    {
        public void Configure(EntityTypeBuilder<City> builder)
        {
            builder.ToTable(nameof(City));
            
            builder.Property(x => x.Name)
                .HasMaxLength(200)
                .IsRequired();

            builder.Property(x => x.CountyId)
                .IsRequired();

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.HasOne(x => x.County)
                .WithMany(x => x.Cities)
                .HasForeignKey(x => x.CountyId);
        }
    }
}
