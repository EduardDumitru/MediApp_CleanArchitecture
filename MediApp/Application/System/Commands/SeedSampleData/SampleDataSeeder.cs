using Application.CommandsAndQueries;
using Application.Common.Constants;
using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.System.Commands.SeedSampleData
{
    public class SampleDataSeeder(IApplicationDbContext context, IIdentityService identityService, IDateTime dateTime)
    {
        public async Task SeedAllAsync(CancellationToken cancellationToken)
        {
            if (context.Employees.Any()) return;

            // await SeedCountriesAsync(cancellationToken);

            // await SeedCountiesAsync(cancellationToken);

            // await SeedCitiesAsync(cancellationToken);

            // await SeedGendersAsync(cancellationToken);

            // await SeedRolesAsync(cancellationToken);

            //await SeedUsersAsync(cancellationToken);

            //await SeedDiagnosesAsync(cancellationToken);

            //await SeedDrugsAsync(cancellationToken);

            //await SeedDiagnosisXDrugsAsync(cancellationToken);

            //await SeedClinicsAsync(cancellationToken);

            //await SeedEmployeeTypesAsync(cancellationToken);

            //await SeedMedicalCheckTypesAsync(cancellationToken);

            //await SeedEmployeesAsync(cancellationToken);

            //await SeedHolidayIntervalsAsync(cancellationToken);

            //await SeedMedicalChecksAsync(cancellationToken);

            //await SeedPrescriptionsAsync(cancellationToken);

            //await SeedPrescriptionXDrugsAsync(cancellationToken);
        }

        private async Task SeedUsersAsync(CancellationToken cancellationToken)
        {
            var galatiCity =
                await context.Cities.Include(x => x.County).ThenInclude(x => x.Country)
                    .FirstOrDefaultAsync(x => x.Name == "Galati" && !x.Deleted, cancellationToken);

            var gender =
                await context.Genders.FirstOrDefaultAsync(x => x.Name == "Male", cancellationToken);

            var userToAdd = new AddUserCommand
            {
                Email = "admin@admin.com",
                Password = "Aa@12345",
                FirstName = "Admin",
                LastName = "Admin",
                StreetNo = "14",
                Address = "Bl 1 Ap 1",
                StreetName = "Admin Str",
                Cnp = "1211118123456",
                PhoneNumber = "0712345678",
                CountryId = galatiCity.County.Country.Id,
                CountyId = galatiCity.County.Id,
                CityId = galatiCity.Id,
                GenderId = gender.Id
            };

            var result = await identityService.CreateUserSeedAsync(userToAdd);

            await identityService.AddToRoleAsync(result.UserId, RoleConstants.Admin);

            userToAdd = new AddUserCommand
            {
                Email = "doctor@doctor.com",
                Password = "Aa@12345",
                FirstName = "Doctor",
                LastName = "Doctor",
                MiddleName = "The",
                StreetNo = "15",
                Cnp = "1211118124456",
                PhoneNumber = "0713345678",
                Address = "Bl 1 Ap 2",
                StreetName = "Doctor Str",
                CountryId = galatiCity.County.Country.Id,
                CountyId = galatiCity.County.Id,
                CityId = galatiCity.Id,
                GenderId = gender.Id
            };

            result = await identityService.CreateUserSeedAsync(userToAdd);

            await identityService.AddToRoleAsync(result.UserId, RoleConstants.Doctor);

            userToAdd = new AddUserCommand
            {
                Email = "nurse@nurse.com",
                Password = "Aa@12345",
                FirstName = "Nurse",
                LastName = "Nurse",
                StreetNo = "12",
                Address = "Bl 1 Ap 3",
                StreetName = "Nurse Str",
                Cnp = "1211218124456",
                PhoneNumber = "0714345678",
                CountryId = galatiCity.County.Country.Id,
                CountyId = galatiCity.County.Id,
                CityId = galatiCity.Id,
                GenderId = gender.Id
            };

            result = await identityService.CreateUserSeedAsync(userToAdd);

            await identityService.AddToRoleAsync(result.UserId, RoleConstants.Nurse);

            userToAdd = new AddUserCommand
            {
                Email = "user@user.com",
                Password = "Aa@12345",
                FirstName = "User",
                LastName = "User",
                StreetNo = "16",
                Address = "Bl 1 Ap 4",
                StreetName = "User Str",
                Cnp = "1211018124456",
                PhoneNumber = "0734345678",
                CountryId = galatiCity.County.Country.Id,
                CountyId = galatiCity.County.Id,
                CityId = galatiCity.Id,
                GenderId = gender.Id
            };

            result = await identityService.CreateUserSeedAsync(userToAdd);

            await identityService.AddToRoleAsync(result.UserId, RoleConstants.User);

            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedRolesAsync(CancellationToken cancellationToken)
        {
            await identityService.CreateRoleAsync(RoleConstants.Admin);
            await identityService.CreateRoleAsync(RoleConstants.Nurse);
            await identityService.CreateRoleAsync(RoleConstants.Doctor);
            await identityService.CreateRoleAsync(RoleConstants.User);

            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedCountriesAsync(CancellationToken cancellationToken)
        {
            var countries = new[]
            {
                new Country {Name = "Romania"},
                new Country {Name = "SUA"},
                new Country {Name = "Bulgaria"}
            };

            await context.Countries.AddRangeAsync(countries, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedCountiesAsync(CancellationToken cancellationToken)
        {
            var romania =
                await context.Countries.FirstOrDefaultAsync(x => x.Name == "Romania" && !x.Deleted, cancellationToken);
            var sua = await context.Countries.FirstOrDefaultAsync(x => x.Name == "SUA" && !x.Deleted,
                cancellationToken);
            var bulgaria =
                await context.Countries.FirstOrDefaultAsync(x => x.Name == "Bulgaria" && !x.Deleted,
                    cancellationToken);

            var counties = new[]
            {
                new County {Name = "Galati", CountryId = romania.Id},
                new County {Name = "Prahova", CountryId = romania.Id},
                new County {Name = "Sofia", CountryId = bulgaria.Id},
                new County {Name = "California", CountryId = sua.Id}
            };

            await context.Counties.AddRangeAsync(counties, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedCitiesAsync(CancellationToken cancellationToken)
        {
            var galati =
                await context.Counties.FirstOrDefaultAsync(x => x.Name == "Galati" && !x.Deleted, cancellationToken);
            var prahova =
                await context.Counties.FirstOrDefaultAsync(x => x.Name == "Prahova" && !x.Deleted, cancellationToken);
            var sofia = await context.Counties.FirstOrDefaultAsync(x => x.Name == "Sofia" && !x.Deleted,
                cancellationToken);
            var california =
                await context.Counties.FirstOrDefaultAsync(x => x.Name == "California" && !x.Deleted,
                    cancellationToken);

            var cities = new[]
            {
                new City {Name = "Galati", CountyId = galati.Id},
                new City {Name = "Tecuci", CountyId = galati.Id},
                new City {Name = "Targu Bujor", CountyId = galati.Id},
                new City {Name = "Ploiesti", CountyId = prahova.Id},
                new City {Name = "Sofia", CountyId = sofia.Id},
                new City {Name = "Los Angeles", CountyId = california.Id}
            };

            await context.Cities.AddRangeAsync(cities, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedDiagnosesAsync(CancellationToken cancellationToken)
        {
            var diagnoses = new[]
            {
                new Diagnosis {Name = "Flu"},
                new Diagnosis {Name = "Cold"},
                new Diagnosis {Name = "Conjunctivitis"}
            };

            await context.Diagnoses.AddRangeAsync(diagnoses, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedDrugsAsync(CancellationToken cancellationToken)
        {
            var drugs = new[]
            {
                new Drug {Name = "Strepsils"},
                new Drug {Name = "Olynth"},
                new Drug {Name = "Paracetamol"},
                new Drug {Name = "Azyter"}
            };

            await context.Drugs.AddRangeAsync(drugs, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedDiagnosisXDrugsAsync(CancellationToken cancellationToken)
        {
            var flu = await context.Diagnoses.FirstOrDefaultAsync(x => x.Name == "Flu" && !x.Deleted,
                cancellationToken);
            var cold = await context.Diagnoses.FirstOrDefaultAsync(x => x.Name == "Cold" && !x.Deleted,
                cancellationToken);
            var conjunctivits =
                await context.Diagnoses.FirstOrDefaultAsync(x => x.Name == "Conjunctivitis" && !x.Deleted,
                    cancellationToken);
            var strepsils =
                await context.Drugs.FirstOrDefaultAsync(x => x.Name == "Strepsils" && !x.Deleted, cancellationToken);
            var olynth =
                await context.Drugs.FirstOrDefaultAsync(x => x.Name == "Olynth" && !x.Deleted, cancellationToken);
            var paracetamol =
                await context.Drugs.FirstOrDefaultAsync(x => x.Name == "Paracetamol" && !x.Deleted, cancellationToken);
            var azyter =
                await context.Drugs.FirstOrDefaultAsync(x => x.Name == "Azyter" && !x.Deleted, cancellationToken);
            var diagnosisXDrugs = new[]
            {
                new DiagnosisXDrug {DiagnosisId = flu.Id, DrugId = paracetamol.Id},
                new DiagnosisXDrug {DiagnosisId = flu.Id, DrugId = strepsils.Id},
                new DiagnosisXDrug {DiagnosisId = flu.Id, DrugId = olynth.Id},
                new DiagnosisXDrug {DiagnosisId = cold.Id, DrugId = olynth.Id},
                new DiagnosisXDrug {DiagnosisId = cold.Id, DrugId = strepsils.Id},
                new DiagnosisXDrug {DiagnosisId = conjunctivits.Id, DrugId = azyter.Id}
            };

            await context.DiagnosisXDrugs.AddRangeAsync(diagnosisXDrugs, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedGendersAsync(CancellationToken cancellationToken)
        {
            var genders = new[]
            {
                new Gender {Name = "Male"},
                new Gender {Name = "Female"}
            };

            await context.Genders.AddRangeAsync(genders, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedClinicsAsync(CancellationToken cancellationToken)
        {
            var ploiestiCity = await context.Cities.Include(x => x.County).ThenInclude(x => x.Country)
                .FirstOrDefaultAsync(x => x.Name == "Ploiesti" && !x.Deleted, cancellationToken);

            var galatiCity =
                await context.Cities.Include(x => x.County).ThenInclude(x => x.Country)
                    .FirstOrDefaultAsync(x => x.Name == "Galati" && !x.Deleted, cancellationToken);
            var clinics = new[]
            {
                new Clinic
                {
                    Name = "Clinica Cladire B", Address = "Cladirea B", StreetName = "Iulius", StreetNo = "40A",
                    PhoneNumber = "0236432123", Email = "clinicacladireb@clinica.ro",
                    CountryId = galatiCity.County.Country.Id,
                    CountyId = galatiCity.County.Id, CityId = galatiCity.Id
                },
                new Clinic
                {
                    Name = "Clinica Cladire A", Address = "Cladirea A", StreetName = "Iulius", StreetNo = "40B",
                    PhoneNumber = "0236432143", Email = "clinicacladirea@clinica.ro",
                    CountryId = ploiestiCity.County.Country.Id,
                    CountyId = ploiestiCity.County.Id, CityId = ploiestiCity.Id
                }
            };

            await context.Clinics.AddRangeAsync(clinics, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedEmployeeTypesAsync(CancellationToken cancellationToken)
        {
            var employeeTypes = new[]
            {
                new EmployeeType {Name = "Doctor"},
                new EmployeeType {Name = "Nurse"}
            };

            await context.EmployeeTypes.AddRangeAsync(employeeTypes, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedMedicalCheckTypesAsync(CancellationToken cancellationToken)
        {
            var medicalCheckTypes = new[]
            {
                new MedicalCheckType {Name = "Obstetrics-Gynecology"},
                new MedicalCheckType {Name = "Family"},
                new MedicalCheckType {Name = "Pediatrics"},
                new MedicalCheckType {Name = "Dermatology"},
                new MedicalCheckType {Name = "Nutrition"}
            };

            await context.MedicalCheckTypes.AddRangeAsync(medicalCheckTypes, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedEmployeesAsync(CancellationToken cancellationToken)
        {
            var userDoctorId = await identityService.GetUserIdAsync("doctor@doctor.com");
            var docProfile =
                await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userDoctorId.Value, cancellationToken);
            var nurseId = await identityService.GetUserIdAsync("nurse@nurse.com");
            var nurseProfile =
                await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == nurseId, cancellationToken);
            var doctorEmpType =
                await context.EmployeeTypes.FirstOrDefaultAsync(x => x.Name == "Doctor" && !x.Deleted,
                    cancellationToken);
            var nurseEmpType =
                await context.EmployeeTypes.FirstOrDefaultAsync(x => x.Name == "Nurse" && !x.Deleted,
                    cancellationToken);
            var familyType =
                await context.MedicalCheckTypes.FirstOrDefaultAsync(x => x.Name == "Family" && !x.Deleted,
                    cancellationToken);
            var galatiClinic =
                await context.Clinics.FirstOrDefaultAsync(x => x.Email == "clinicacladireb@clinica.ro" && !x.Deleted,
                    cancellationToken);
            var employees = new[]
            {
                new Employee
                {
                    StartHour = TimeSpan.Parse("08:00"), EndHour = TimeSpan.Parse("14:00"),
                    UserProfileId = docProfile.Id,
                    MedicalCheckTypeId = familyType.Id, EmployeeTypeId = doctorEmpType.Id, TerminationDate = null,
                    ClinicId = galatiClinic.Id
                },
                new Employee
                {
                    StartHour = TimeSpan.Parse("08:00"), EndHour = TimeSpan.Parse("14:00"),
                    UserProfileId = nurseProfile.Id,
                    MedicalCheckTypeId = null, EmployeeTypeId = nurseEmpType.Id, TerminationDate = null,
                    ClinicId = galatiClinic.Id
                }
            };

            await context.Employees.AddRangeAsync(employees, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedHolidayIntervalsAsync(CancellationToken cancellationToken)
        {
            var userDoctorId = await identityService.GetUserIdAsync("doctor@doctor.com");
            var docProfile =
                await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userDoctorId.Value, cancellationToken);

            var holidayIntervals = new[]
            {
                new HolidayInterval
                {
                    StartDate = dateTime.Now.AddDays(100),
                    EndDate = dateTime.Now.AddDays(105),
                    EmployeeId = docProfile.Id
                }
            };

            await context.HolidayIntervals.AddRangeAsync(holidayIntervals, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedMedicalChecksAsync(CancellationToken cancellationToken)
        {
            var galatiClinic =
                await context.Clinics.FirstOrDefaultAsync(x => x.Email == "clinicacladireb@clinica.ro" && !x.Deleted,
                    cancellationToken);
            var patientId = await identityService.GetUserIdAsync("user@user.com");
            var patientProfile =
                await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == patientId.Value, cancellationToken);
            var userDoctorId = await identityService.GetUserIdAsync("doctor@doctor.com");
            var docProfile =
                await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userDoctorId.Value, cancellationToken);
            var doctor = await context.Employees.Include(x => x.MedicalCheckType).FirstOrDefaultAsync(
                x => x.UserProfileId == docProfile.Id && !x.Deleted,
                cancellationToken);
            var diagnosis = await context.Diagnoses.FirstOrDefaultAsync(x => x.Name == "Flu", cancellationToken);
            var now = dateTime.Now;
            var medicalChecks = new[]
            {
                new MedicalCheck
                {
                    Appointment = new DateTime(now.Year, now.Month + 1, now.Day, 12, 0, 0),
                    ClinicId = galatiClinic.Id,
                    DiagnosisId = null,
                    EmployeeId = doctor.Id,
                    PatientId = patientProfile.Id,
                    MedicalCheckTypeId = doctor.MedicalCheckType.Id
                },
                new MedicalCheck
                {
                    Appointment = new DateTime(now.Year, now.Month - 1, now.Day, 12, 0, 0),
                    ClinicId = galatiClinic.Id,
                    DiagnosisId = diagnosis.Id,
                    EmployeeId = doctor.Id,
                    PatientId = patientProfile.Id,
                    MedicalCheckTypeId = doctor.MedicalCheckType.Id
                }
            };

            await context.MedicalChecks.AddRangeAsync(medicalChecks, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedPrescriptionsAsync(CancellationToken cancellationToken)
        {
            var patientId = await identityService.GetUserIdAsync("user@user.com");
            var patientProfile =
                await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == patientId.Value, cancellationToken);
            var now = dateTime.Now;
            var medicalCheck =
                await context.MedicalChecks.FirstOrDefaultAsync(x => x.Appointment < now &&
                                                                       x.PatientId == patientProfile.Id,
                    cancellationToken);
            var prescriptions = new[]
            {
                new Prescription
                {
                    NoOfDays = 5,
                    Description = "You must stay in bed",
                    PatientId = patientProfile.Id,
                    EmployeeId = medicalCheck.EmployeeId,
                    MedicalCheckId = medicalCheck.Id
                }
            };

            await context.Prescriptions.AddRangeAsync(prescriptions, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedPrescriptionXDrugsAsync(CancellationToken cancellationToken)
        {
            var patientId = await identityService.GetUserIdAsync("user@user.com");
            var patientProfile =
                await context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == patientId.Value, cancellationToken);
            var now = dateTime.Now;
            var medicalCheck =
                await context.MedicalChecks.FirstOrDefaultAsync(x => x.Appointment < now, cancellationToken);
            var prescription = await context.Prescriptions.FirstOrDefaultAsync(
                x => x.MedicalCheckId == medicalCheck.Id && x.PatientId == patientProfile.Id, cancellationToken);
            var olynth =
                await context.Drugs.FirstOrDefaultAsync(x => x.Name == "Olynth" && !x.Deleted, cancellationToken);
            var paracetamol =
                await context.Drugs.FirstOrDefaultAsync(x => x.Name == "Paracetamol" && !x.Deleted, cancellationToken);
            var strepsils =
                await context.Drugs.FirstOrDefaultAsync(x => x.Name == "Strepsils" && !x.Deleted, cancellationToken);
            var prescriptionXDrugs = new[]
            {
                new PrescriptionXDrug
                {
                    PrescriptionId = prescription.Id,
                    DrugId = paracetamol.Id,
                    Box = 1,
                    PerInterval = 1,
                    Interval = TimeSpan.Parse("08:00")
                },
                new PrescriptionXDrug
                {
                    PrescriptionId = prescription.Id,
                    DrugId = olynth.Id,
                    Box = 1,
                    PerInterval = 1,
                    Interval = TimeSpan.Parse("06:00")
                },
                new PrescriptionXDrug
                {
                    PrescriptionId = prescription.Id,
                    DrugId = strepsils.Id,
                    Box = 1,
                    PerInterval = 1,
                    Interval = TimeSpan.Parse("07:00")
                }
            };

            await context.PrescriptionXDrugs.AddRangeAsync(prescriptionXDrugs, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}