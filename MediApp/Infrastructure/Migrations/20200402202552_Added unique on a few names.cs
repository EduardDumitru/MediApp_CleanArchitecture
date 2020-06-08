using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class Addeduniqueonafewnames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                "IX_MedicalCheckType_Name",
                "MedicalCheckType",
                "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_Gender_Name",
                "Gender",
                "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_EmployeeType_Name",
                "EmployeeType",
                "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_Drug_Name",
                "Drug",
                "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_Diagnosis_Name",
                "Diagnosis",
                "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_Country_Name",
                "Country",
                "Name",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_MedicalCheckType_Name",
                "MedicalCheckType");

            migrationBuilder.DropIndex(
                "IX_Gender_Name",
                "Gender");

            migrationBuilder.DropIndex(
                "IX_EmployeeType_Name",
                "EmployeeType");

            migrationBuilder.DropIndex(
                "IX_Drug_Name",
                "Drug");

            migrationBuilder.DropIndex(
                "IX_Diagnosis_Name",
                "Diagnosis");

            migrationBuilder.DropIndex(
                "IX_Country_Name",
                "Country");
        }
    }
}