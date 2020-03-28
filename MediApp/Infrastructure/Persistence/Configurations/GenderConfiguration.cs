using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class GenderConfiguration : IEntityTypeConfiguration<Gender>
    {
        public void Configure(EntityTypeBuilder<Gender> builder)
        {
            builder.ToTable(nameof(Gender));

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.Property(x => x.Name)
                .HasMaxLength(150)
                .IsRequired();
        }
    }
}
