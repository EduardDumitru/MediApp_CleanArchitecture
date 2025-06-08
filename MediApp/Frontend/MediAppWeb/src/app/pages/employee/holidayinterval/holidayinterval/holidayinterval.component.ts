import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, of, Subscription } from 'rxjs';

import {
  HolidayIntervalData,
  HolidayIntervalDetails,
  UpdateHolidayIntervalCommand,
  AddHolidayIntervalCommand,
  RestoreHolidayIntervalCommand
} from 'src/app/@core/data/holidayinterval';
import { UIService } from 'src/app/shared/ui.service';
import { Result } from 'src/app/@core/data/common/result';
import { AuthService } from 'src/app/auth/auth.service';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { EmployeeData, EmployeeDetails } from 'src/app/@core/data/employee';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-holidayinterval',
  templateUrl: './holidayinterval.component.html',
  styleUrls: ['./holidayinterval.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class HolidayintervalComponent implements OnInit, OnDestroy {
  isLoading = false;
  holidayIntervalForm!: FormGroup;
  holidayIntervalId?: number;
  isDeleted: boolean | undefined = false;
  currentUserId = -1;
  currentEmployeeUserId: number | undefined = -1;
  employeeId = '';
  isAdmin = false;
  currentUserIdSubscription!: Subscription;
  adminSubscription!: Subscription;
  minDate: Date = new Date();
  employeeSelectList: SelectItemsList = new SelectItemsList();

  // Dependency injection using inject function
  private readonly holidayIntervalData = inject(HolidayIntervalData);
  private readonly uiService = inject(UIService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly authService = inject(AuthService);
  private readonly employeeData = inject(EmployeeData);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.minDate = this.getMinDate();

    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
    });

    this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.holidayIntervalId = id;
    }

    this.initForm();
    this.getEmployees();
  }

  ngOnDestroy(): void {
    this.currentUserIdSubscription?.unsubscribe();
    this.adminSubscription?.unsubscribe();
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  getMinDate(): Date {
    const tempDate = new Date();
    const day = tempDate.getDay();

    // Prevent Saturday and Sunday from being selected.
    if (day === 0) {
      tempDate.setTime(tempDate.getTime() + 1000 * 60 * 60 * 24);
      return tempDate;
    }

    if (day === 6) {
      tempDate.setTime(tempDate.getTime() + 1000 * 60 * 60 * 48);
      return tempDate;
    }

    return tempDate;
  }

  disableEmployeeId(): void {
    this.holidayIntervalForm.get('employeeId')?.disable();
  }

  initForm(): void {
    this.holidayIntervalForm = this.fb.group({
      employeeId: ['', Validators.required],
      startDate: [{ value: this.minDate, disabled: true }, Validators.required],
      endDate: [{ value: this.minDate, disabled: true }, Validators.required]
    });

    if (this.holidayIntervalId) {
      this.getHolidayInterval();
    } else {
      if (!this.isAdmin) {
        this.getEmployee();
      }
    }
  }

  getEmployee(): void {
    this.isLoading = true;

    this.employeeData.GetEmployeeDetailsByCurrentUser()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({} as EmployeeDetails);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((employee: EmployeeDetails) => {
        if (!employee) return;

        this.employeeId = employee.id.toString();
        this.currentEmployeeUserId = employee.userProfileId;
        this.holidayIntervalForm.patchValue({ employeeId: this.employeeId });
        this.disableEmployeeId();
      });
  }

  getEmployees(): void {
    this.isLoading = true;

    this.employeeData.GetAllEmployeesDropdown()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((employees: SelectItemsList) => {
        this.employeeSelectList = employees;
      });
  }

  getHolidayInterval(): void {
    this.isLoading = true;

    this.holidayIntervalData.GetHolidayIntervalDetails(this.holidayIntervalId!)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({} as HolidayIntervalDetails);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((holidayInterval: HolidayIntervalDetails) => {
        if (!holidayInterval) return;

        this.holidayIntervalForm.setValue({
          employeeId: holidayInterval.employeeId.toString(),
          startDate: new Date(holidayInterval.startDate),
          endDate: new Date(holidayInterval.endDate)
        });

        this.isDeleted = holidayInterval.deleted;
        this.employeeId = holidayInterval.employeeId.toString();
        this.currentEmployeeUserId = holidayInterval.userProfileId;
        this.disableEmployeeId();

        if (this.isDeleted) {
          this.holidayIntervalForm.disable();
        }
      });
  }

  onSubmit(): void {
    if (this.holidayIntervalForm.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.holidayIntervalId) {
      this.updateHolidayInterval();
    } else {
      this.addHolidayInterval();
    }
  }

  updateHolidayInterval(): void {
    const formValues = this.holidayIntervalForm.getRawValue();

    const updateCommand: UpdateHolidayIntervalCommand = {
      id: this.holidayIntervalId!,
      employeeId: +this.employeeId,
      startDate: new Date(formValues.startDate),
      endDate: new Date(formValues.endDate)
    };

    this.holidayIntervalData.UpdateHolidayInterval(updateCommand)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((res: Result | null) => {
        if (!res) return;

        this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        this.location.back();
      });
  }

  addHolidayInterval(): void {
    const formValues = this.holidayIntervalForm.getRawValue();

    const addCommand: AddHolidayIntervalCommand = {
      employeeId: +formValues.employeeId,
      startDate: new Date(formValues.startDate),
      endDate: new Date(formValues.endDate)
    };

    this.holidayIntervalData.AddHolidayInterval(addCommand)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((res: Result | null) => {
        if (!res) return;

        this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        this.location.back();
      });
  }

  deleteHolidayInterval(): void {
    this.isLoading = true;

    this.holidayIntervalData.DeleteHolidayInterval(this.holidayIntervalId!)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((res: Result | null) => {
        if (!res) return;

        this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        this.location.back();
      });
  }

  restoreHolidayInterval(): void {
    this.isLoading = true;

    const restoreCommand: RestoreHolidayIntervalCommand = {
      id: this.holidayIntervalId!
    };

    this.holidayIntervalData.RestoreHolidayInterval(restoreCommand)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((res: Result | null) => {
        if (!res) return;

        this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        this.location.back();
      });
  }

  isCurrentUserOwner(): boolean {
    return this.currentUserId === this.currentEmployeeUserId;
  }

  goBack(): void {
    this.location.back();
  }
}