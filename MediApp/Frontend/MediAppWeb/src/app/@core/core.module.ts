import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  LayoutService,
  SeoService,
  StateService,
} from './utils';
import { UserData } from './data/userclasses/user';
import { UserProfileData } from './data/userclasses/userprofile';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/userprofile.service';
import { CityData } from './data/city';
import { CityService } from './services/city.service';
import { CountryData } from './data/country';
import { CountryService } from './services/country.service';
import { CountyData } from './data/county';
import { CountyService } from './services/county.service';
import { DiagnosisService } from './services/diagnosis.service';
import { DiagnosisData } from './data/diagnosis';
import { DiagnosisXDrugData } from './data/diagnosisxdrug';
import { DiagnosisXDrugService } from './services/diagnosisxdrug.service';
import { DrugData } from './data/drug';
import { DrugService } from './services/drug.service';
import { EmployeeData } from './data/employee';
import { EmployeeService } from './services/employee.service';
import { EmployeeTypeData } from './data/employeetype';
import { EmployeeTypeService } from './services/employeetype.service';
import { GenderData } from './data/gender';
import { GenderService } from './services/gender.service';
import { HolidayIntervalData } from './data/holidayinterval';
import { HolidayIntervalService } from './services/holidayinterval.service';
import { MedicalCheckData } from './data/medicalcheck';
import { MedicalCheckService } from './services/medicalcheck.service';
import { MedicalCheckTypeData } from './data/medicalchecktype';
import { MedicalCheckTypeService } from './services/medicalchecktype.service';
import { PrescriptionData } from './data/prescription';
import { PrescriptionService } from './services/prescription.service';
import { PrescriptionXDrugService } from './services/prescriptionxdrug.service';
import { PrescriptionXDrugData } from './data/prescriptionxdrug';

const socialLinks = [
  {
    url: 'https://github.com/EduardDumitru/MediApp_CleanArchitecture',
    target: '_blank',
    icon: 'github',
  }
];

const DATA_SERVICES = [
  { provide: UserData, useClass: UserService },
  { provide: UserProfileData, useClass: UserProfileService },
  { provide: CityData, useClass: CityService},
  { provide: CountryData, useClass: CountryService},
  { provide: CountyData, useClass: CountyService},
  { provide: DiagnosisData, useClass: DiagnosisService},
  { provide: DiagnosisXDrugData, useClass: DiagnosisXDrugService},
  { provide: DrugData, useClass: DrugService},
  { provide: EmployeeData, useClass: EmployeeService},
  { provide: EmployeeTypeData, useClass: EmployeeTypeService},
  { provide: GenderData, useClass: GenderService},
  { provide: HolidayIntervalData, useClass: HolidayIntervalService},
  { provide: MedicalCheckData, useClass: MedicalCheckService},
  { provide: MedicalCheckTypeData, useClass: MedicalCheckTypeService},
  { provide: PrescriptionData, useClass: PrescriptionService},
  { provide: PrescriptionXDrugData, useClass: PrescriptionXDrugService}
];

export const NB_CORE_PROVIDERS = [
  ...DATA_SERVICES,
  LayoutService,
  SeoService,
  StateService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return  {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    } as ModuleWithProviders;
  }
}
