import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalChecksByClinicComponent } from './medical-checks-by-clinic.component';

describe('MedicalChecksByClinicComponent', () => {
  let component: MedicalChecksByClinicComponent;
  let fixture: ComponentFixture<MedicalChecksByClinicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalChecksByClinicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalChecksByClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
