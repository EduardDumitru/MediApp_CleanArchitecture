using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class AllTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "Country",
                table => new
                {
                    Id = table.Column<short>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_Country", x => x.Id); });

            migrationBuilder.CreateTable(
                "Diagnosis",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_Diagnosis", x => x.Id); });

            migrationBuilder.CreateTable(
                "Drug",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_Drug", x => x.Id); });

            migrationBuilder.CreateTable(
                "EmployeeType",
                table => new
                {
                    Id = table.Column<short>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_EmployeeType", x => x.Id); });

            migrationBuilder.CreateTable(
                "Gender",
                table => new
                {
                    Id = table.Column<short>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_Gender", x => x.Id); });

            migrationBuilder.CreateTable(
                "MedicalCheckType",
                table => new
                {
                    Id = table.Column<short>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_MedicalCheckType", x => x.Id); });

            migrationBuilder.CreateTable(
                "Role",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Role", x => x.Id); });

            migrationBuilder.CreateTable(
                "User",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: false),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: true, defaultValue: true)
                },
                constraints: table => { table.PrimaryKey("PK_User", x => x.Id); });

            migrationBuilder.CreateTable(
                "County",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    CountryId = table.Column<short>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_County", x => x.Id);
                    table.ForeignKey(
                        "FK_County_Country_CountryId",
                        x => x.CountryId,
                        "Country",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "DiagnosisXDrug",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    DiagnosisId = table.Column<int>(nullable: false),
                    DrugId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiagnosisXDrug", x => x.Id);
                    table.ForeignKey(
                        "FK_DiagnosisXDrug_Diagnosis_DiagnosisId",
                        x => x.DiagnosisId,
                        "Diagnosis",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_DiagnosisXDrug_Drug_DrugId",
                        x => x.DrugId,
                        "Drug",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "AspNetRoleClaims",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<long>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        "FK_AspNetRoleClaims_Role_RoleId",
                        x => x.RoleId,
                        "Role",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "AspNetUserClaims",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<long>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        "FK_AspNetUserClaims_User_UserId",
                        x => x.UserId,
                        "User",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "AspNetUserLogins",
                table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new {x.LoginProvider, x.ProviderKey});
                    table.ForeignKey(
                        "FK_AspNetUserLogins_User_UserId",
                        x => x.UserId,
                        "User",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "AspNetUserRoles",
                table => new
                {
                    UserId = table.Column<long>(nullable: false),
                    RoleId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new {x.UserId, x.RoleId});
                    table.ForeignKey(
                        "FK_AspNetUserRoles_Role_RoleId",
                        x => x.RoleId,
                        "Role",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_AspNetUserRoles_User_UserId",
                        x => x.UserId,
                        "User",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "AspNetUserTokens",
                table => new
                {
                    UserId = table.Column<long>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new {x.UserId, x.LoginProvider, x.Name});
                    table.ForeignKey(
                        "FK_AspNetUserTokens_User_UserId",
                        x => x.UserId,
                        "User",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "City",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 200, nullable: false),
                    CountyId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_City", x => x.Id);
                    table.ForeignKey(
                        "FK_City_County_CountyId",
                        x => x.CountyId,
                        "County",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "Clinic",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Address = table.Column<string>(maxLength: 200, nullable: true),
                    StreetName = table.Column<string>(maxLength: 200, nullable: true),
                    StreetNo = table.Column<string>(nullable: false),
                    PhoneNumber = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: false),
                    CountryId = table.Column<short>(nullable: false),
                    CountyId = table.Column<int>(nullable: false),
                    CityId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clinic", x => x.Id);
                    table.ForeignKey(
                        "FK_Clinic_City_CityId",
                        x => x.CityId,
                        "City",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Clinic_Country_CountryId",
                        x => x.CountryId,
                        "Country",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Clinic_County_CountyId",
                        x => x.CountyId,
                        "County",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "UserProfile",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    FirstName = table.Column<string>(maxLength: 200, nullable: false),
                    MiddleName = table.Column<string>(maxLength: 200, nullable: true),
                    LastName = table.Column<string>(maxLength: 200, nullable: false),
                    Address = table.Column<string>(maxLength: 200, nullable: true),
                    StreetName = table.Column<string>(maxLength: 200, nullable: true),
                    StreetNo = table.Column<string>(nullable: false),
                    PhoneNumber = table.Column<string>(nullable: false),
                    EmailAddress = table.Column<string>(nullable: false),
                    CNP = table.Column<string>(maxLength: 13, nullable: false),
                    CountryId = table.Column<short>(nullable: false),
                    CountyId = table.Column<int>(nullable: false),
                    CityId = table.Column<int>(nullable: false),
                    GenderId = table.Column<short>(nullable: false),
                    UserId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfile", x => x.Id);
                    table.ForeignKey(
                        "FK_UserProfile_City_CityId",
                        x => x.CityId,
                        "City",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_UserProfile_Country_CountryId",
                        x => x.CountryId,
                        "Country",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_UserProfile_County_CountyId",
                        x => x.CountyId,
                        "County",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_UserProfile_Gender_GenderId",
                        x => x.GenderId,
                        "Gender",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "Employee",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    StartHour = table.Column<TimeSpan>(nullable: false),
                    EndHour = table.Column<TimeSpan>(nullable: false),
                    TerminationDate = table.Column<DateTime>(nullable: true),
                    UserProfileId = table.Column<long>(nullable: false),
                    EmployeeTypeId = table.Column<short>(nullable: false),
                    MedicalCheckTypeId = table.Column<short>(nullable: true),
                    ClinicId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.Id);
                    table.ForeignKey(
                        "FK_Employee_Clinic_ClinicId",
                        x => x.ClinicId,
                        "Clinic",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Employee_EmployeeType_EmployeeTypeId",
                        x => x.EmployeeTypeId,
                        "EmployeeType",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Employee_MedicalCheckType_MedicalCheckTypeId",
                        x => x.MedicalCheckTypeId,
                        "MedicalCheckType",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Employee_UserProfile_UserProfileId",
                        x => x.UserProfileId,
                        "UserProfile",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "HolidayInterval",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    StartDate = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    EmployeeId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HolidayInterval", x => x.Id);
                    table.ForeignKey(
                        "FK_HolidayInterval_Employee_EmployeeId",
                        x => x.EmployeeId,
                        "Employee",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "MedicalCheck",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    Appointment = table.Column<DateTime>(nullable: false),
                    ClinicId = table.Column<int>(nullable: false),
                    DiagnosisId = table.Column<int>(nullable: true),
                    EmployeeId = table.Column<long>(nullable: false),
                    PatientId = table.Column<long>(nullable: false),
                    MedicalCheckTypeId = table.Column<short>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalCheck", x => x.Id);
                    table.ForeignKey(
                        "FK_MedicalCheck_Clinic_ClinicId",
                        x => x.ClinicId,
                        "Clinic",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_MedicalCheck_Diagnosis_DiagnosisId",
                        x => x.DiagnosisId,
                        "Diagnosis",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_MedicalCheck_Employee_EmployeeId",
                        x => x.EmployeeId,
                        "Employee",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_MedicalCheck_MedicalCheckType_MedicalCheckTypeId",
                        x => x.MedicalCheckTypeId,
                        "MedicalCheckType",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_MedicalCheck_UserProfile_PatientId",
                        x => x.PatientId,
                        "UserProfile",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "Prescription",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    NoOfDays = table.Column<int>(nullable: false),
                    Description = table.Column<string>(nullable: false),
                    PatientId = table.Column<long>(nullable: false),
                    MedicalCheckId = table.Column<long>(nullable: false),
                    EmployeeId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescription", x => x.Id);
                    table.ForeignKey(
                        "FK_Prescription_Employee_EmployeeId",
                        x => x.EmployeeId,
                        "Employee",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Prescription_MedicalCheck_MedicalCheckId",
                        x => x.MedicalCheckId,
                        "MedicalCheck",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Prescription_UserProfile_PatientId",
                        x => x.PatientId,
                        "UserProfile",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "PrescriptionXDrug",
                table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<long>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedBy = table.Column<long>(nullable: true),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false, defaultValue: false),
                    DeletedBy = table.Column<long>(nullable: true),
                    DeletedOn = table.Column<DateTime>(nullable: true),
                    PrescriptionId = table.Column<long>(nullable: false),
                    DrugId = table.Column<long>(nullable: false),
                    Box = table.Column<short>(nullable: false),
                    PerInterval = table.Column<float>(nullable: false),
                    Interval = table.Column<TimeSpan>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionXDrug", x => x.Id);
                    table.ForeignKey(
                        "FK_PrescriptionXDrug_Drug_DrugId",
                        x => x.DrugId,
                        "Drug",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_PrescriptionXDrug_Prescription_PrescriptionId",
                        x => x.PrescriptionId,
                        "Prescription",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                "IX_AspNetRoleClaims_RoleId",
                "AspNetRoleClaims",
                "RoleId");

            migrationBuilder.CreateIndex(
                "IX_AspNetUserClaims_UserId",
                "AspNetUserClaims",
                "UserId");

            migrationBuilder.CreateIndex(
                "IX_AspNetUserLogins_UserId",
                "AspNetUserLogins",
                "UserId");

            migrationBuilder.CreateIndex(
                "IX_AspNetUserRoles_RoleId",
                "AspNetUserRoles",
                "RoleId");

            migrationBuilder.CreateIndex(
                "IX_City_CountyId",
                "City",
                "CountyId");

            migrationBuilder.CreateIndex(
                "IX_Clinic_CityId",
                "Clinic",
                "CityId");

            migrationBuilder.CreateIndex(
                "IX_Clinic_CountryId",
                "Clinic",
                "CountryId");

            migrationBuilder.CreateIndex(
                "IX_Clinic_CountyId",
                "Clinic",
                "CountyId");

            migrationBuilder.CreateIndex(
                "IX_County_CountryId",
                "County",
                "CountryId");

            migrationBuilder.CreateIndex(
                "IX_DiagnosisXDrug_DiagnosisId",
                "DiagnosisXDrug",
                "DiagnosisId");

            migrationBuilder.CreateIndex(
                "IX_DiagnosisXDrug_DrugId",
                "DiagnosisXDrug",
                "DrugId");

            migrationBuilder.CreateIndex(
                "IX_Employee_ClinicId",
                "Employee",
                "ClinicId");

            migrationBuilder.CreateIndex(
                "IX_Employee_EmployeeTypeId",
                "Employee",
                "EmployeeTypeId");

            migrationBuilder.CreateIndex(
                "IX_Employee_MedicalCheckTypeId",
                "Employee",
                "MedicalCheckTypeId");

            migrationBuilder.CreateIndex(
                "IX_Employee_UserProfileId",
                "Employee",
                "UserProfileId");

            migrationBuilder.CreateIndex(
                "IX_HolidayInterval_EmployeeId",
                "HolidayInterval",
                "EmployeeId");

            migrationBuilder.CreateIndex(
                "IX_MedicalCheck_ClinicId",
                "MedicalCheck",
                "ClinicId");

            migrationBuilder.CreateIndex(
                "IX_MedicalCheck_DiagnosisId",
                "MedicalCheck",
                "DiagnosisId");

            migrationBuilder.CreateIndex(
                "IX_MedicalCheck_EmployeeId",
                "MedicalCheck",
                "EmployeeId");

            migrationBuilder.CreateIndex(
                "IX_MedicalCheck_MedicalCheckTypeId",
                "MedicalCheck",
                "MedicalCheckTypeId");

            migrationBuilder.CreateIndex(
                "IX_MedicalCheck_PatientId",
                "MedicalCheck",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_Prescription_EmployeeId",
                "Prescription",
                "EmployeeId");

            migrationBuilder.CreateIndex(
                "IX_Prescription_MedicalCheckId",
                "Prescription",
                "MedicalCheckId");

            migrationBuilder.CreateIndex(
                "IX_Prescription_PatientId",
                "Prescription",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_PrescriptionXDrug_DrugId",
                "PrescriptionXDrug",
                "DrugId");

            migrationBuilder.CreateIndex(
                "IX_PrescriptionXDrug_PrescriptionId",
                "PrescriptionXDrug",
                "PrescriptionId");

            migrationBuilder.CreateIndex(
                "RoleNameIndex",
                "Role",
                "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                "EmailIndex",
                "User",
                "NormalizedEmail");

            migrationBuilder.CreateIndex(
                "UserNameIndex",
                "User",
                "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                "IX_User_PhoneNumber",
                "User",
                "PhoneNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_UserProfile_CNP",
                "UserProfile",
                "CNP",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_UserProfile_CityId",
                "UserProfile",
                "CityId");

            migrationBuilder.CreateIndex(
                "IX_UserProfile_CountryId",
                "UserProfile",
                "CountryId");

            migrationBuilder.CreateIndex(
                "IX_UserProfile_CountyId",
                "UserProfile",
                "CountyId");

            migrationBuilder.CreateIndex(
                "IX_UserProfile_EmailAddress",
                "UserProfile",
                "EmailAddress",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_UserProfile_GenderId",
                "UserProfile",
                "GenderId");

            migrationBuilder.CreateIndex(
                "IX_UserProfile_PhoneNumber",
                "UserProfile",
                "PhoneNumber",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "AspNetRoleClaims");

            migrationBuilder.DropTable(
                "AspNetUserClaims");

            migrationBuilder.DropTable(
                "AspNetUserLogins");

            migrationBuilder.DropTable(
                "AspNetUserRoles");

            migrationBuilder.DropTable(
                "AspNetUserTokens");

            migrationBuilder.DropTable(
                "DiagnosisXDrug");

            migrationBuilder.DropTable(
                "HolidayInterval");

            migrationBuilder.DropTable(
                "PrescriptionXDrug");

            migrationBuilder.DropTable(
                "Role");

            migrationBuilder.DropTable(
                "User");

            migrationBuilder.DropTable(
                "Drug");

            migrationBuilder.DropTable(
                "Prescription");

            migrationBuilder.DropTable(
                "MedicalCheck");

            migrationBuilder.DropTable(
                "Diagnosis");

            migrationBuilder.DropTable(
                "Employee");

            migrationBuilder.DropTable(
                "Clinic");

            migrationBuilder.DropTable(
                "EmployeeType");

            migrationBuilder.DropTable(
                "MedicalCheckType");

            migrationBuilder.DropTable(
                "UserProfile");

            migrationBuilder.DropTable(
                "City");

            migrationBuilder.DropTable(
                "Gender");

            migrationBuilder.DropTable(
                "County");

            migrationBuilder.DropTable(
                "Country");
        }
    }
}