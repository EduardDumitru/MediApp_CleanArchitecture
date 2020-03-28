using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ClinicConfiguration : IEntityTypeConfiguration<Clinic>
    {
        public void Configure(EntityTypeBuilder<Clinic> builder)
        {
            builder.ToTable(nameof(Clinic));
            builder.Property(x => x.PhoneNumber)
                .IsRequired();
            builder.Property(x => x.Email)
                .IsRequired();
            builder.Property(x => x.Address)
                .HasMaxLength(200);
            builder.Property(x => x.StreetName)
                .HasMaxLength(200);
            builder.Property(x => x.StreetNo)
                .IsRequired();
            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.HasOne(x => x.Country)
                .WithMany(x => x.Clinics)
                .HasForeignKey(x => x.CountryId);
            builder.HasOne(x => x.County)
                .WithMany(x => x.Clinics)
                .HasForeignKey(x => x.CountyId);
            builder.HasOne(x => x.City)
                .WithMany(x => x.Clinics)
                .HasForeignKey(x => x.CityId);
        }
    }
}
