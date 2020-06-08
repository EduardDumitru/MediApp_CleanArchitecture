using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class HolidayIntervalConfiguration : IEntityTypeConfiguration<HolidayInterval>
    {
        public void Configure(EntityTypeBuilder<HolidayInterval> builder)
        {
            builder.ToTable(nameof(HolidayInterval));

            builder.Property(x => x.Deleted)
                .HasDefaultValue(false);

            builder.HasOne(x => x.Employee)
                .WithMany(x => x.HolidayIntervals)
                .HasForeignKey(x => x.EmployeeId);
        }
    }
}