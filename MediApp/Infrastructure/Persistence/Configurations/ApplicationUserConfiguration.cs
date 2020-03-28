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
            builder.Property(x => x.FirstName)
                .HasMaxLength(200)
                .IsRequired();
            builder.Property(x => x.MiddleName)
                .HasMaxLength(200);
            builder.Property(x => x.LastName)
                .HasMaxLength(200)
                .IsRequired();
            builder.Property(x => x.PhoneNumber)
                .IsRequired();
            builder.Property(x => x.Address)
                .HasMaxLength(200);
            builder.Property(x => x.StreetName)
                .HasMaxLength(200);
            builder.Property(x => x.StreetNo)
                .IsRequired();
            builder.Property(x => x.CNP)
                .HasMaxLength(13)
                .IsRequired();
            builder.Property(x => x.IsActive)
                .IsRequired();
            builder.Property(x => x.CountryId)
                .IsRequired();
            builder.Property(x => x.CountyId)
                .IsRequired();
            builder.Property(x => x.CityId)
                .IsRequired();
            builder.Property(x => x.GenderId)
                .IsRequired();
            builder.Property(x => x.IsActive)
                .HasDefaultValue(true);
        }
    }
}
