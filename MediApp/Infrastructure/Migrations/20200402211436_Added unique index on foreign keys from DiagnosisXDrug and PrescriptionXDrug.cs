using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class AddeduniqueindexonforeignkeysfromDiagnosisXDrugandPrescriptionXDrug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_PrescriptionXDrug_PrescriptionId",
                "PrescriptionXDrug");

            migrationBuilder.DropIndex(
                "IX_DiagnosisXDrug_DiagnosisId",
                "DiagnosisXDrug");

            migrationBuilder.CreateIndex(
                "IX_PrescriptionXDrug_PrescriptionId_DrugId",
                "PrescriptionXDrug",
                new[] {"PrescriptionId", "DrugId"},
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_DiagnosisXDrug_DiagnosisId_DrugId",
                "DiagnosisXDrug",
                new[] {"DiagnosisId", "DrugId"},
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_PrescriptionXDrug_PrescriptionId_DrugId",
                "PrescriptionXDrug");

            migrationBuilder.DropIndex(
                "IX_DiagnosisXDrug_DiagnosisId_DrugId",
                "DiagnosisXDrug");

            migrationBuilder.CreateIndex(
                "IX_PrescriptionXDrug_PrescriptionId",
                "PrescriptionXDrug",
                "PrescriptionId");

            migrationBuilder.CreateIndex(
                "IX_DiagnosisXDrug_DiagnosisId",
                "DiagnosisXDrug",
                "DiagnosisId");
        }
    }
}