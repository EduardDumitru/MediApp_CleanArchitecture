import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalchecktypesComponent } from './medicalchecktypes.component';

describe('MedicalchecktypesComponent', () => {
  let component: MedicalchecktypesComponent;
  let fixture: ComponentFixture<MedicalchecktypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalchecktypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalchecktypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
