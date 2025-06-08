import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeetypeComponent } from './employeetype/employeetype/employeetype.component';
import { EmployeetypesComponent } from './employeetype/employeetypes/employeetypes.component';
import { EmployeeComponent } from './employee/employee/employee.component';
import { EmployeesComponent } from './employee/employees/employees.component';
import { HolidayintervalComponent } from './holidayinterval/holidayinterval/holidayinterval.component';
import { HolidayintervalsComponent } from './holidayinterval/holidayintervals/holidayintervals.component';
import { MedicalchecktypeComponent } from './medicalchecktype/medicalchecktype/medicalchecktype.component';
import { MedicalchecktypesComponent } from './medicalchecktype/medicalchecktypes/medicalchecktypes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeRoutingModule } from './employee-routes';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    EmployeeRoutingModule,
    EmployeetypeComponent,
    EmployeetypesComponent,
    EmployeeComponent,
    EmployeesComponent,
    HolidayintervalComponent,
    HolidayintervalsComponent,
    MedicalchecktypeComponent,
    MedicalchecktypesComponent
  ]
})
export class EmployeeModule { }
