using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class AddeduniqueindexonforeignkeysfromDiagnosisXDrugandPrescriptionXDrug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PrescriptionXDrug_PrescriptionId",
                table: "PrescriptionXDrug");

            migrationBuilder.DropIndex(
                name: "IX_DiagnosisXDrug_DiagnosisId",
                table: "DiagnosisXDrug");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionXDrug_PrescriptionId_DrugId",
                table: "PrescriptionXDrug",
                columns: new[] { "PrescriptionId", "DrugId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DiagnosisXDrug_DiagnosisId_DrugId",
                table: "DiagnosisXDrug",
                columns: new[] { "DiagnosisId", "DrugId" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PrescriptionXDrug_PrescriptionId_DrugId",
                table: "PrescriptionXDrug");

            migrationBuilder.DropIndex(
                name: "IX_DiagnosisXDrug_DiagnosisId_DrugId",
                table: "DiagnosisXDrug");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionXDrug_PrescriptionId",
                table: "PrescriptionXDrug",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_DiagnosisXDrug_DiagnosisId",
                table: "DiagnosisXDrug",
                column: "DiagnosisId");
        }
    }
}
