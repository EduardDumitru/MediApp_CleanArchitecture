using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class PrescriptionXDruguniqueindexremoved : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_PrescriptionXDrug_PrescriptionId_DrugId",
                "PrescriptionXDrug");

            migrationBuilder.CreateIndex(
                "IX_PrescriptionXDrug_PrescriptionId",
                "PrescriptionXDrug",
                "PrescriptionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_PrescriptionXDrug_PrescriptionId",
                "PrescriptionXDrug");

            migrationBuilder.CreateIndex(
                "IX_PrescriptionXDrug_PrescriptionId_DrugId",
                "PrescriptionXDrug",
                new[] {"PrescriptionId", "DrugId"},
                unique: true);
        }
    }
}