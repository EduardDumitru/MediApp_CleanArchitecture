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
            builder.Property(x => x.PhoneNumber)
                .IsRequired();
            builder.HasIndex(x => x.PhoneNumber)
                .IsUnique();
            builder.Property(x => x.IsActive)
                .HasDefaultValue(true);
        }
    }
}
