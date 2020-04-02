using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class Addeduniqueonafewnames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MedicalCheckType_Name",
                table: "MedicalCheckType",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Gender_Name",
                table: "Gender",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeType_Name",
                table: "EmployeeType",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Drug_Name",
                table: "Drug",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Diagnosis_Name",
                table: "Diagnosis",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Country_Name",
                table: "Country",
                column: "Name",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MedicalCheckType_Name",
                table: "MedicalCheckType");

            migrationBuilder.DropIndex(
                name: "IX_Gender_Name",
                table: "Gender");

            migrationBuilder.DropIndex(
                name: "IX_EmployeeType_Name",
                table: "EmployeeType");

            migrationBuilder.DropIndex(
                name: "IX_Drug_Name",
                table: "Drug");

            migrationBuilder.DropIndex(
                name: "IX_Diagnosis_Name",
                table: "Diagnosis");

            migrationBuilder.DropIndex(
                name: "IX_Country_Name",
                table: "Country");
        }
    }
}
