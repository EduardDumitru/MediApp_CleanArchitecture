import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMedicalCheckComponent } from './update-medical-check.component';

describe('UpdateMedicalCheckComponent', () => {
  let component: UpdateMedicalCheckComponent;
  let fixture: ComponentFixture<UpdateMedicalCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateMedicalCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMedicalCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
