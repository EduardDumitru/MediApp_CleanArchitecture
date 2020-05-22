import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayintervalsComponent } from './holidayintervals.component';

describe('HolidayintervalsComponent', () => {
  let component: HolidayintervalsComponent;
  let fixture: ComponentFixture<HolidayintervalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayintervalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayintervalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
