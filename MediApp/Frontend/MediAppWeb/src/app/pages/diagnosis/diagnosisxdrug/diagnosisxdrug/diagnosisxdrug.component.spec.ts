import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisXDrugComponent } from './diagnosisxdrug.component';

describe('DiagnosisxdrugComponent', () => {
  let component: DiagnosisXDrugComponent;
  let fixture: ComponentFixture<DiagnosisXDrugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosisXDrugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosisXDrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
