import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionsByMedicalCheckComponent } from './prescriptions-by-medical-check.component';

describe('PrescriptionsByMedicalCheckComponent', () => {
  let component: PrescriptionsByMedicalCheckComponent;
  let fixture: ComponentFixture<PrescriptionsByMedicalCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionsByMedicalCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionsByMedicalCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
