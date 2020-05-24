import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HolidayIntervalData, HolidayIntervalDetails, 
  UpdateHolidayIntervalCommand, AddHolidayIntervalCommand, RestoreHolidayIntervalCommand } from 'src/app/@core/data/holidayinterval';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { EmployeeData } from 'src/app/@core/data/employee';

@Component({
  selector: 'app-holidayinterval',
  templateUrl: './holidayinterval.component.html',
  styleUrls: ['./holidayinterval.component.scss']
})
export class HolidayintervalComponent implements OnInit {
  isLoading = false;
  holidayIntervalForm: FormGroup;
  holidayIntervalId: number;
  isDeleted = false;
  currentUserId = -1;
  employeeId = 0;
  isAdmin = false;
  currentUserIdSubscription: Subscription;
  adminSubscription: Subscription;
  employeeSelectList: SelectItemsList = new SelectItemsList();
  constructor(private holidayIntervalData: HolidayIntervalData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location, private authService: AuthService,
    private employeeData: EmployeeData) { }

  ngOnInit() {
      this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
      });
      this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        });
      if (Number(this.route.snapshot.params.id)) {
          this.holidayIntervalId = +this.route.snapshot.params.id;
      }
      this.initForm();
      this.getEmployees();
  }

  disableEmployeeId() {
    this.holidayIntervalForm.get('employeeId').disable();
  }

  initForm() {
      this.holidayIntervalForm = new FormGroup({
          employeeId: new FormControl('', [Validators.required]),
          startDate: new FormControl(new Date(), [Validators.required]),
          endDate: new FormControl(new Date(), [Validators.required])
      })
      if (this.holidayIntervalId) {
          this.getHolidayInterval();
      } else {
        this.holidayIntervalForm.patchValue({employeeId: this.currentUserId})
        if (!this.isAdmin) {
          this.disableEmployeeId();
        }
      }
  }

  getEmployees() {
    this.employeeData.GetAllEmployeesDropdown().subscribe((employees: SelectItemsList) => {
      this.employeeSelectList = employees;
    },
    error => {
        this.uiService.showErrorSnackbar(error.message, null, 3000);
        this.isLoading = false;
    });
  }

  getHolidayInterval() {
      this.isLoading = true;
      this.holidayIntervalData.GetHolidayIntervalDetails(this.holidayIntervalId).subscribe((holidayInterval: HolidayIntervalDetails) => {
          this.holidayIntervalForm.setValue({employeeId: holidayInterval.employeeId.toString(),
            startDate: new Date(holidayInterval.startDate),
            endDate: new Date(holidayInterval.endDate)});
          this.isDeleted = holidayInterval.deleted;
          this.employeeId = holidayInterval.employeeId;
          this.disableEmployeeId();
          if (this.isDeleted) {
              this.holidayIntervalForm.disable();
          }
          this.isLoading = false;
      },
          error => {
              this.uiService.showErrorSnackbar(error.message, null, 3000);
              this.isLoading = false;
          });
  }

  onSubmit() {
      this.isLoading = true;
      if (this.holidayIntervalId) {
          this.updateHolidayInterval();
      } else {
          this.addHolidayInterval();
      }
  }

  updateHolidayInterval() {
      const updateHolidayIntervalCommand: UpdateHolidayIntervalCommand = {
          id: this.holidayIntervalId,
          employeeId: this.employeeId,
          startDate: new Date(this.holidayIntervalForm.value.startDate),
          endDate: new Date(this.holidayIntervalForm.value.endDate)
      } as UpdateHolidayIntervalCommand;

      this.holidayIntervalData.UpdateHolidayInterval(updateHolidayIntervalCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
          console.log(error);
      });
  }

  addHolidayInterval() {
      const addHolidayIntervalCommand: AddHolidayIntervalCommand = {
        employeeId: +this.holidayIntervalForm.value.employeeId,
        startDate: new Date(this.holidayIntervalForm.value.startDate),
        endDate: new Date(this.holidayIntervalForm.value.endDate)
    } as AddHolidayIntervalCommand;

      this.holidayIntervalData.AddHolidayInterval(addHolidayIntervalCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  deleteHolidayInterval() {
      this.isLoading = true;
      this.holidayIntervalData.DeleteHolidayInterval(this.holidayIntervalId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      })
  }

  restoreHolidayInterval() {
      this.isLoading = true;
      const restoreHolidayIntervalCommand: RestoreHolidayIntervalCommand = {
          id: this.holidayIntervalId
      } as RestoreHolidayIntervalCommand;

      this.holidayIntervalData.RestoreHolidayInterval(restoreHolidayIntervalCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      })
  }

  isCurrentUserOwner() {
    return this.currentUserId === this.employeeId;
  }

  goBack() {
      this._location.back();
    }

}
