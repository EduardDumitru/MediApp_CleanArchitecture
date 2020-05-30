import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePrescriptionsComponent } from './employeeprescriptions.component';

describe('EmployeePrescriptionsComponent', () => {
  let component: EmployeePrescriptionsComponent;
  let fixture: ComponentFixture<EmployeePrescriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePrescriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
