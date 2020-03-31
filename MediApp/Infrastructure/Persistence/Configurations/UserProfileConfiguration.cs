using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
    {
        public void Configure(EntityTypeBuilder<UserProfile> builder)
        {
            builder.ToTable("UserProfile");
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
            builder.HasIndex(x => x.PhoneNumber)
                .IsUnique();
            builder.Property(x => x.EmailAddress)
                .IsRequired();
            builder.HasIndex(x => x.EmailAddress)
                .IsUnique();
            builder.Property(x => x.Address)
                .HasMaxLength(200);
            builder.Property(x => x.StreetName)
                .HasMaxLength(200);
            builder.Property(x => x.StreetNo)
                .IsRequired();
            builder.Property(x => x.CNP)
                .HasMaxLength(13)
                .IsRequired();
            builder.HasIndex(x => x.CNP)
                .IsUnique();
            builder.Property(x => x.CountryId)
                .IsRequired();
            builder.Property(x => x.CountyId)
                .IsRequired();
            builder.Property(x => x.CityId)
                .IsRequired();
            builder.Property(x => x.GenderId)
                .IsRequired();

            builder.HasOne(x => x.Country)
                .WithMany(x => x.UserProfiles)
                .HasForeignKey(x => x.CountryId);
            builder.HasOne(x => x.County)
                .WithMany(x => x.UserProfiles)
                .HasForeignKey(x => x.CountyId);
            builder.HasOne(x => x.City)
                .WithMany(x => x.UserProfiles)
                .HasForeignKey(x => x.CityId);
            builder.HasOne(x => x.Gender)
                .WithMany(x => x.UserProfiles)
                .HasForeignKey(x => x.GenderId);
        }
    }
}
