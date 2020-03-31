using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Constants;
using Application.Common.Interfaces;
using Application.Users.Commands.AddUser;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.System.Commands.SeedSampleData
{
    public class SampleDataSeeder
    {
        private readonly IApplicationDbContext _context;
        private readonly IIdentityService _identityService;
        private readonly IDateTime _dateTime;

        public SampleDataSeeder(IApplicationDbContext context, IIdentityService identityService, IDateTime dateTime)
        {
            _context = context;
            _identityService = identityService;
            _dateTime = dateTime;
        }

        public async Task SeedAllAsync(CancellationToken cancellationToken)
        {
            if (_context.Employees.Any())
            {
                return;
            }

            await SeedCountriesAsync(cancellationToken);

            await SeedCountiesAsync(cancellationToken);

            await SeedCitiesAsync(cancellationToken);

            await SeedGendersAsync(cancellationToken);

            await SeedRolesAsync(cancellationToken);

            await SeedUsersAsync(cancellationToken);

            await SeedDiagnosesAsync(cancellationToken);

            await SeedDrugsAsync(cancellationToken);

            await SeedDiagnosisXDrugsAsync(cancellationToken);

            await SeedClinicsAsync(cancellationToken);

            await SeedEmployeeTypesAsync(cancellationToken);

            await SeedMedicalCheckTypesAsync(cancellationToken);

            await SeedEmployeesAsync(cancellationToken);

            await SeedHolidayIntervalsAsync(cancellationToken);

            await SeedMedicalChecksAsync(cancellationToken);

            await SeedPrescriptionsAsync(cancellationToken);

            await SeedPrescriptionXDrugsAsync(cancellationToken);
        }

        private async Task SeedUsersAsync(CancellationToken cancellationToken)
        {
            var galatiCity =
                await _context.Cities.Include(x => x.County).ThenInclude(x => x.Country)
                    .FirstOrDefaultAsync(x => x.Name == "Galati" && !x.Deleted, cancellationToken);

            var gender =
                await _context.Genders.FirstOrDefaultAsync(x => x.Name == "Male", cancellationToken);

            var userToAdd = new AddUserCommand()
            {
                Email = "admin@admin.com",
                Password = "Aa@12345",
                FirstName = "Admin",
                LastName = "Admin",
                StreetNo = "14",
                Address = "Bl 1 Ap 1",
                StreetName = "Admin Str",
                CNP = "1211118123456",
                PhoneNumber = "0712345678",
                CountryId = galatiCity.County.Country.Id,
                CountyId = galatiCity.County.Id,
                CityId = galatiCity.Id,
                GenderId = gender.Id
            };

            var result = await _identityService.CreateUserSeedAsync(userToAdd);

            await _identityService.AddToRoleAsync(result.UserId, RoleConstants.Admin);

            userToAdd = new AddUserCommand()
            {
                Email = "doctor@doctor.com",
                Password = "Aa@12345",
                FirstName = "Doctor",
                LastName = "Doctor",
                MiddleName = "The",
                StreetNo = "15",
                CNP = "1211118124456",
                PhoneNumber = "0713345678",
                Address = "Bl 1 Ap 2",
                StreetName = "Doctor Str",
                CountryId = galatiCity.County.Country.Id,
                CountyId = galatiCity.County.Id,
                CityId = galatiCity.Id,
                GenderId = gender.Id
            };

            result = await _identityService.CreateUserSeedAsync(userToAdd);

            await _identityService.AddToRoleAsync(result.UserId, RoleConstants.Doctor);

            userToAdd = new AddUserCommand()
            {
                Email = "nurse@nurse.com",
                Password = "Aa@12345",
                FirstName = "Nurse",
                LastName = "Nurse",
                StreetNo = "12",
                Address = "Bl 1 Ap 3",
                StreetName = "Nurse Str",
                CNP = "1211218124456",
                PhoneNumber = "0714345678",
                CountryId = galatiCity.County.Country.Id,
                CountyId = galatiCity.County.Id,
                CityId = galatiCity.Id,
                GenderId = gender.Id
            };

            result = await _identityService.CreateUserSeedAsync(userToAdd);

            await _identityService.AddToRoleAsync(result.UserId, RoleConstants.Nurse);

            userToAdd = new AddUserCommand()
            {
                Email = "user@user.com",
                Password = "Aa@12345",
                FirstName = "User",
                LastName = "User",
                StreetNo = "16",
                Address = "Bl 1 Ap 4",
                StreetName = "User Str",
                CNP = "1211018124456",
                PhoneNumber = "0734345678",
                CountryId = galatiCity.County.Country.Id,
                CountyId = galatiCity.County.Id,
                CityId = galatiCity.Id,
                GenderId = gender.Id
            };

            result = await _identityService.CreateUserSeedAsync(userToAdd);

            await _identityService.AddToRoleAsync(result.UserId, RoleConstants.User);

            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedRolesAsync(CancellationToken cancellationToken)
        {
            await _identityService.CreateRoleAsync(RoleConstants.Admin);
            await _identityService.CreateRoleAsync(RoleConstants.Nurse);
            await _identityService.CreateRoleAsync(RoleConstants.Doctor);
            await _identityService.CreateRoleAsync(RoleConstants.User);

            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedCountriesAsync(CancellationToken cancellationToken)
        {
            var countries = new[]
            {
                new Country {Name = "Romania"},
                new Country {Name = "SUA"},
                new Country {Name = "Bulgaria"}
            };

            await _context.Countries.AddRangeAsync(countries, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedCountiesAsync(CancellationToken cancellationToken)
        {
            var romania = await _context.Countries.FirstOrDefaultAsync(x => x.Name == "Romania" && !x.Deleted, cancellationToken);
            var sua = await _context.Countries.FirstOrDefaultAsync(x => x.Name == "SUA" && !x.Deleted, cancellationToken);
            var bulgaria = await _context.Countries.FirstOrDefaultAsync(x => x.Name == "Bulgaria" && !x.Deleted, cancellationToken);

            var counties = new[]
            {
                new County {Name = "Galati", CountryId = romania.Id},
                new County {Name = "Prahova", CountryId = romania.Id},
                new County {Name = "Sofia", CountryId = bulgaria.Id},
                new County {Name = "California", CountryId = sua.Id}
            };

            await _context.Counties.AddRangeAsync(counties, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedCitiesAsync(CancellationToken cancellationToken)
        {
            var galati = await _context.Counties.FirstOrDefaultAsync(x => x.Name == "Galati" && !x.Deleted, cancellationToken);
            var prahova = await _context.Counties.FirstOrDefaultAsync(x => x.Name == "Prahova" && !x.Deleted, cancellationToken);
            var sofia = await _context.Counties.FirstOrDefaultAsync(x => x.Name == "Sofia" && !x.Deleted, cancellationToken);
            var california = await _context.Counties.FirstOrDefaultAsync(x => x.Name == "California" && !x.Deleted, cancellationToken);

            var cities = new[]
            {
                new City {Name = "Galati", CountyId = galati.Id},
                new City {Name = "Tecuci", CountyId = galati.Id},
                new City {Name = "Targu Bujor", CountyId = galati.Id},
                new City {Name = "Ploiesti", CountyId = prahova.Id},
                new City {Name = "Sofia", CountyId = sofia.Id},
                new City {Name = "Los Angeles", CountyId = california.Id}
            };

            await _context.Cities.AddRangeAsync(cities, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedDiagnosesAsync(CancellationToken cancellationToken)
        {
            var diagnoses = new[]
            {
                new Diagnosis {Name = "Flu"},
                new Diagnosis {Name = "Cold"},
                new Diagnosis {Name = "Conjunctivitis"}
            };

            await _context.Diagnoses.AddRangeAsync(diagnoses, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedDrugsAsync(CancellationToken cancellationToken)
        {
            var drugs = new[]
            {
                new Drug {Name = "Strepsils"},
                new Drug {Name = "Olynth"},
                new Drug {Name = "Paracetamol"},
                new Drug {Name = "Azyter"},
            };

            await _context.Drugs.AddRangeAsync(drugs, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedDiagnosisXDrugsAsync(CancellationToken cancellationToken)
        {
            var flu = await _context.Diagnoses.FirstOrDefaultAsync(x => x.Name == "Flu" && !x.Deleted, cancellationToken);
            var cold = await _context.Diagnoses.FirstOrDefaultAsync(x => x.Name == "Cold" && !x.Deleted, cancellationToken);
            var conjunctivits =
                await _context.Diagnoses.FirstOrDefaultAsync(x => x.Name == "Conjunctivitis" && !x.Deleted, cancellationToken);
            var strepsils = await _context.Drugs.FirstOrDefaultAsync(x => x.Name == "Strepsils" && !x.Deleted, cancellationToken);
            var olynth = await _context.Drugs.FirstOrDefaultAsync(x => x.Name == "Olynth" && !x.Deleted, cancellationToken);
            var paracetamol = await _context.Drugs.FirstOrDefaultAsync(x => x.Name == "Paracetamol" && !x.Deleted, cancellationToken);
            var azyter = await _context.Drugs.FirstOrDefaultAsync(x => x.Name == "Azyter" && !x.Deleted, cancellationToken);
            var diagnosisXDrugs = new[]
            {
                new DiagnosisXDrug {DiagnosisId = flu.Id, DrugId = paracetamol.Id},
                new DiagnosisXDrug {DiagnosisId = flu.Id, DrugId = strepsils.Id},
                new DiagnosisXDrug {DiagnosisId = flu.Id, DrugId = olynth.Id},
                new DiagnosisXDrug {DiagnosisId = cold.Id, DrugId = olynth.Id},
                new DiagnosisXDrug {DiagnosisId = cold.Id, DrugId = strepsils.Id},
                new DiagnosisXDrug {DiagnosisId = conjunctivits.Id, DrugId = azyter.Id}
            };

            await _context.DiagnosisXDrugs.AddRangeAsync(diagnosisXDrugs, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedGendersAsync(CancellationToken cancellationToken)
        {
            var genders = new[]
            {
                new Gender {Name = "Male"},
                new Gender {Name = "Female"}
            };

            await _context.Genders.AddRangeAsync(genders, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedClinicsAsync(CancellationToken cancellationToken)
        {
            var ploiestiCity = await _context.Cities.Include(x => x.County).ThenInclude(x => x.Country)
                .FirstOrDefaultAsync(x => x.Name == "Ploiesti" && !x.Deleted, cancellationToken);

            var galatiCity =
                await _context.Cities.Include(x => x.County).ThenInclude(x => x.Country)
                    .FirstOrDefaultAsync(x => x.Name == "Galati" && !x.Deleted, cancellationToken);
            var clinics = new[]
            {
                new Clinic
                {
                    Name = "Clinica Cladire B", Address = "Cladirea B", StreetName = "Iulius", StreetNo = "40A",
                    PhoneNumber = "0236432123", Email = "clinicacladireb@clinica.ro", CountryId = galatiCity.County.Country.Id,
                    CountyId = galatiCity.County.Id, CityId = galatiCity.Id
                },
                new Clinic
                {
                    Name = "Clinica Cladire A", Address = "Cladirea A", StreetName = "Iulius", StreetNo = "40B",
                    PhoneNumber = "0236432143", Email = "clinicacladirea@clinica.ro", CountryId = ploiestiCity.County.Country.Id,
                    CountyId = ploiestiCity.County.Id, CityId = ploiestiCity.Id
                }
            };

            await _context.Clinics.AddRangeAsync(clinics, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedEmployeeTypesAsync(CancellationToken cancellationToken)
        {
            var employeeTypes = new[]
            {
                new EmployeeType {Name = "Doctor"},
                new EmployeeType {Name = "Nurse"}
            };

            await _context.EmployeeTypes.AddRangeAsync(employeeTypes, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
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

            await _context.MedicalCheckTypes.AddRangeAsync(medicalCheckTypes, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedEmployeesAsync(CancellationToken cancellationToken)
        {
            var userDoctorId = await _identityService.GetUserIdAsync("doctor@doctor.com");
            var docProfile =
                await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userDoctorId.Value, cancellationToken);
            var nurseId = await _identityService.GetUserIdAsync("nurse@nurse.com");
            var nurseProfile =
                await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == nurseId, cancellationToken);
            var doctorEmpType = await _context.EmployeeTypes.FirstOrDefaultAsync(x => x.Name == "Doctor" && !x.Deleted, cancellationToken);
            var nurseEmpType = await _context.EmployeeTypes.FirstOrDefaultAsync(x => x.Name == "Nurse" && !x.Deleted, cancellationToken);
            var familyType =
                await _context.MedicalCheckTypes.FirstOrDefaultAsync(x => x.Name == "Family" && !x.Deleted, cancellationToken);
            var galatiClinic = await _context.Clinics.FirstOrDefaultAsync(x => x.Email == "clinicacladireb@clinica.ro" && !x.Deleted, cancellationToken);
            var employees = new[]
            {
                new Employee
                {
                    StartHour = TimeSpan.Parse("08:00"), EndHour = TimeSpan.Parse("14:00"), UserProfileId = docProfile.Id,
                    MedicalCheckTypeId = familyType.Id, EmployeeTypeId = doctorEmpType.Id, TerminationDate = null,
                    ClinicId = galatiClinic.Id
                },
                new Employee
                {
                    StartHour = TimeSpan.Parse("08:00"), EndHour = TimeSpan.Parse("14:00"), UserProfileId = nurseProfile.Id,
                    MedicalCheckTypeId = null, EmployeeTypeId = nurseEmpType.Id, TerminationDate = null,
                    ClinicId = galatiClinic.Id
                }
            };

            await _context.Employees.AddRangeAsync(employees, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedHolidayIntervalsAsync(CancellationToken cancellationToken)
        {
            var userDoctorId = await _identityService.GetUserIdAsync("doctor@doctor.com");
            var docProfile =
                await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userDoctorId.Value, cancellationToken);

            var holidayIntervals = new[]
            {
                new HolidayInterval
                {
                    StartDate = _dateTime.Now.AddDays(100),
                    EndDate = _dateTime.Now.AddDays(105),
                    EmployeeId = docProfile.Id
                }
            };

            await _context.HolidayIntervals.AddRangeAsync(holidayIntervals, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedMedicalChecksAsync(CancellationToken cancellationToken)
        {
            var galatiClinic =
                await _context.Clinics.FirstOrDefaultAsync(x => x.Email == "clinicacladireb@clinica.ro" && !x.Deleted,
                    cancellationToken);
            var patientId = await _identityService.GetUserIdAsync("user@user.com");
            var patientProfile =
                await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == patientId.Value, cancellationToken);
            var userDoctorId = await _identityService.GetUserIdAsync("doctor@doctor.com");
            var docProfile =
                await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userDoctorId.Value, cancellationToken);
            var doctor = await _context.Employees.Include(x => x.MedicalCheckType).FirstOrDefaultAsync(
                x => x.UserProfileId == docProfile.Id && !x.Deleted,
                cancellationToken);
            var diagnosis = await _context.Diagnoses.FirstOrDefaultAsync(x => x.Name == "Flu", cancellationToken);
            var now = _dateTime.Now;
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

            await _context.MedicalChecks.AddRangeAsync(medicalChecks, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedPrescriptionsAsync(CancellationToken cancellationToken)
        {
            var patientId = await _identityService.GetUserIdAsync("user@user.com");
            var patientProfile =
                await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == patientId.Value, cancellationToken);
            var now = _dateTime.Now;
            var medicalCheck =
                await _context.MedicalChecks.FirstOrDefaultAsync(x => x.Appointment < now &&
                                                                      x.PatientId == patientProfile.Id, cancellationToken);
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

            await _context.Prescriptions.AddRangeAsync(prescriptions, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private async Task SeedPrescriptionXDrugsAsync(CancellationToken cancellationToken)
        {
            var patientId = await _identityService.GetUserIdAsync("user@user.com");
            var patientProfile =
                await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == patientId.Value, cancellationToken);
            var now = _dateTime.Now;
            var medicalCheck =
                await _context.MedicalChecks.FirstOrDefaultAsync(x => x.Appointment < now, cancellationToken);
            var prescription = await _context.Prescriptions.FirstOrDefaultAsync(
                x => x.MedicalCheckId == medicalCheck.Id && x.PatientId == patientProfile.Id, cancellationToken);
            var olynth =
                await _context.Drugs.FirstOrDefaultAsync(x => x.Name == "Olynth" && !x.Deleted, cancellationToken);
            var paracetamol =
                await _context.Drugs.FirstOrDefaultAsync(x => x.Name == "Paracetamol" && !x.Deleted, cancellationToken);
            var strepsils =
                await _context.Drugs.FirstOrDefaultAsync(x => x.Name == "Strepsils" && !x.Deleted, cancellationToken);
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

            await _context.PrescriptionXDrugs.AddRangeAsync(prescriptionXDrugs, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
