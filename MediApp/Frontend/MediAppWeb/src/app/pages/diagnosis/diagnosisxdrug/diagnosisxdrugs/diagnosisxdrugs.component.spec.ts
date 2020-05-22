import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisxdrugsComponent } from './diagnosisxdrugs.component';

describe('DiagnosisxdrugsComponent', () => {
  let component: DiagnosisxdrugsComponent;
  let fixture: ComponentFixture<DiagnosisxdrugsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosisxdrugsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosisxdrugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
