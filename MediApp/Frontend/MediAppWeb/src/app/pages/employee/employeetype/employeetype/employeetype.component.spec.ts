import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetypeComponent } from './employeetype.component';

describe('EmployeetypeComponent', () => {
  let component: EmployeetypeComponent;
  let fixture: ComponentFixture<EmployeetypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeetypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
