using System;
using System.Collections.Generic;
using System.Text;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PrescriptionXDrugConfiguration : IEntityTypeConfiguration<PrescriptionXDrug>
    {
        public void Configure(EntityTypeBuilder<PrescriptionXDrug> builder)
        {
            builder.ToTable(nameof(PrescriptionXDrug));

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.HasOne(x => x.Prescription)
                .WithMany(x => x.PrescriptionXDrugs)
                .HasForeignKey(x => x.PrescriptionId);

            builder.HasOne(x => x.Drug)
                .WithMany(x => x.PrescriptionXDrugs)
                .HasForeignKey(x => x.DrugId);
        }
    }
}
