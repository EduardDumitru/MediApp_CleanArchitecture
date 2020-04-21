using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class PrescriptionXDruguniqueindexremoved : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PrescriptionXDrug_PrescriptionId_DrugId",
                table: "PrescriptionXDrug");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionXDrug_PrescriptionId",
                table: "PrescriptionXDrug",
                column: "PrescriptionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PrescriptionXDrug_PrescriptionId",
                table: "PrescriptionXDrug");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionXDrug_PrescriptionId_DrugId",
                table: "PrescriptionXDrug",
                columns: new[] { "PrescriptionId", "DrugId" },
                unique: true);
        }
    }
}
