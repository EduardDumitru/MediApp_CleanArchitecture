import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalchecksComponent } from './medicalchecks.component';

describe('MedicalchecksComponent', () => {
  let component: MedicalchecksComponent;
  let fixture: ComponentFixture<MedicalchecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalchecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalchecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
