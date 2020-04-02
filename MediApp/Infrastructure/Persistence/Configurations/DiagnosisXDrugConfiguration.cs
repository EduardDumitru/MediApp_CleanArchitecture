using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class DiagnosisXDrugConfiguration : IEntityTypeConfiguration<DiagnosisXDrug>
    {
        public void Configure(EntityTypeBuilder<DiagnosisXDrug> builder)
        {
            builder.ToTable(nameof(DiagnosisXDrug));

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder
                .HasIndex(x => new {x.DiagnosisId, x.DrugId})
                .IsUnique();

            builder.HasOne(x => x.Diagnosis)
                .WithMany(x => x.DiagnosisXDrugs)
                .HasForeignKey(x => x.DiagnosisId);

            builder.HasOne(x => x.Drug)
                .WithMany(x => x.DiagnosisXDrugs)
                .HasForeignKey(x => x.DrugId);
        }
    }
}
