import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPrescriptionsComponent } from './patientprescriptions.component';

describe('PatientPrescriptionsComponent', () => {
  let component: PatientPrescriptionsComponent;
  let fixture: ComponentFixture<PatientPrescriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientPrescriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
