import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalChecksComponent } from './patientmedicalchecks.component';

describe('PatientMedicalChecksComponent', () => {
  let component: PatientMedicalChecksComponent;
  let fixture: ComponentFixture<PatientMedicalChecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientMedicalChecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicalChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
