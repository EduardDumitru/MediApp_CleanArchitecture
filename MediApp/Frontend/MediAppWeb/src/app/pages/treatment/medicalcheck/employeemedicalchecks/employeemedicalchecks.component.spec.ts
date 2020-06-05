import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMedicalChecksComponent } from './employeemedicalchecks.component';

describe('EmployeeMedicalChecksComponent', () => {
  let component: EmployeeMedicalChecksComponent;
  let fixture: ComponentFixture<EmployeeMedicalChecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMedicalChecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMedicalChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
