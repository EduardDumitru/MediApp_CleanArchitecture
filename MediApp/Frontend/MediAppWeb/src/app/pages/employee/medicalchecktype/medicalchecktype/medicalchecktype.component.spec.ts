import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalchecktypeComponent } from './medicalchecktype.component';

describe('MedicalchecktypeComponent', () => {
  let component: MedicalchecktypeComponent;
  let fixture: ComponentFixture<MedicalchecktypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalchecktypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalchecktypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
