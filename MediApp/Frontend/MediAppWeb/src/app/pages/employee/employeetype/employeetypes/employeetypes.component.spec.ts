import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetypesComponent } from './employeetypes.component';

describe('EmployeetypesComponent', () => {
  let component: EmployeetypesComponent;
  let fixture: ComponentFixture<EmployeetypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeetypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeetypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
