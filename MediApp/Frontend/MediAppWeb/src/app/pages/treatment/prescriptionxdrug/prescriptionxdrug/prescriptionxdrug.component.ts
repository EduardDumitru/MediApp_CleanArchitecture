import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { TimeSpan } from 'src/app/@core/data/common/timespan';
import { DrugData } from 'src/app/@core/data/drug';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-prescriptionxdrug',
  templateUrl: './prescriptionxdrug.component.html',
  styleUrls: ['./prescriptionxdrug.component.scss']
})
export class PrescriptionXDrugComponent implements OnInit {
  minutesSelectList: SelectItemsList = new TimeSpan(0, 0).minutesSelectList;
  hoursSelectList: SelectItemsList = new TimeSpan(0, 0).hoursSelectList;
  drugSelectList: SelectItemsList = new SelectItemsList();
  isLoading = true;
  constructor(@Inject(MAT_DIALOG_DATA) public prescriptionXDrugForm: FormGroup,
  private drugData: DrugData, private uiService: UIService) { }

  ngOnInit(): void {
    this.getDrugs();
  }

  getDrugs() {
    this.drugData.GetDrugsDropdown().subscribe((result: SelectItemsList) => {
      this.drugSelectList = result;
      this.isLoading = false;
    }, error => {
        this.isLoading = false;
        this.uiService.showErrorSnackbar(error, null, 3000);
       });
  }
}
