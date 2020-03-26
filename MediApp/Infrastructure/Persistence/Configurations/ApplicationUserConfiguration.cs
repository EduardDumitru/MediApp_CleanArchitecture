using System;
using System.Collections.Generic;
using System.Text;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            builder.ToTable("User");
            builder.Property(t => t.FirstName)
                .HasMaxLength(200)
                .IsRequired();
            builder.Property(t => t.MiddleName)
                .HasMaxLength(200);
            builder.Property(t => t.LastName)
                .HasMaxLength(200)
                .IsRequired();
            builder.Property(t => t.PhoneNumber)
                .IsRequired();
            builder.Property(t => t.Address)
                .HasMaxLength(200);
            builder.Property(t => t.StreetName)
                .HasMaxLength(200);
            builder.Property(t => t.StreetNo)
                .IsRequired();
            builder.Property(t => t.CNP)
                .HasMaxLength(13)
                .IsRequired();
            builder.Property(t => t.CountryId)
                .IsRequired();
            builder.Property(t => t.CountyId)
                .IsRequired();
            builder.Property(t => t.CityId)
                .IsRequired();
            builder.Property(t => t.ClinicId)
                .IsRequired();
        }
    }
}
