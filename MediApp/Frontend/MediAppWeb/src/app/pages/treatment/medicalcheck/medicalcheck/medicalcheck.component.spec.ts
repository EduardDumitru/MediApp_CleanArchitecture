import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCheckComponent } from './medicalcheck.component';

describe('MedicalCheckComponent', () => {
  let component: MedicalCheckComponent;
  let fixture: ComponentFixture<MedicalCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
