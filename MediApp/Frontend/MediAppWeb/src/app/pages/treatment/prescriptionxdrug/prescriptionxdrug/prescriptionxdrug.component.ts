import { Component, OnInit, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { TimeSpan } from 'src/app/@core/data/common/timespan';
import { DrugData } from 'src/app/@core/data/drug';
import { UIService } from 'src/app/shared/ui.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-prescriptionxdrug',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './prescriptionxdrug.component.html',
  styleUrls: ['./prescriptionxdrug.component.scss']
})
export class PrescriptionXDrugComponent implements OnInit {
  minutesSelectList: SelectItemsList = new TimeSpan(0, 0).minutesSelectList;
  hoursSelectList: SelectItemsList = new TimeSpan(0, 0).hoursSelectList;
  drugSelectList: SelectItemsList = new SelectItemsList();
  isLoading = true;

  // Modern dependency injection
  private drugData = inject(DrugData);
  private uiService = inject(UIService);

  constructor(@Inject(MAT_DIALOG_DATA) public prescriptionXDrugForm: FormGroup) { }

  ngOnInit(): void {
    this.getDrugs();
  }

  getDrugs(): void {
    this.isLoading = true;
    this.drugData.GetDrugsDropdown()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((result: SelectItemsList) => {
        this.drugSelectList = result;
      });
  }

  handleNegativeValue(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    if (value < 0) {
      input.value = '1';
      this.prescriptionXDrugForm.get(controlName)?.setValue(1);
    }
  }
}