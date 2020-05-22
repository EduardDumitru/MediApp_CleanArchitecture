import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalcheckComponent } from './medicalcheck.component';

describe('MedicalcheckComponent', () => {
  let component: MedicalcheckComponent;
  let fixture: ComponentFixture<MedicalcheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalcheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
