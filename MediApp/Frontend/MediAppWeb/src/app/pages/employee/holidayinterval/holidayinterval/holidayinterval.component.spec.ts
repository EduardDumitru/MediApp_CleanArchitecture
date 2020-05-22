import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayintervalComponent } from './holidayinterval.component';

describe('HolidayintervalComponent', () => {
  let component: HolidayintervalComponent;
  let fixture: ComponentFixture<HolidayintervalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayintervalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayintervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
