import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { MedicalCheckData, MedicalCheckDetails, UpdateMedicalCheckCommand } from 'src/app/@core/data/medicalcheck';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiagnosisData } from 'src/app/@core/data/diagnosis';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-update-medical-check',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './update-medical-check.component.html',
  styleUrls: ['./update-medical-check.component.scss']
})
export class UpdateMedicalCheckComponent implements OnInit, OnDestroy {
  // State properties
  isLoading = false;
  isDeleted = false;
  diagnosisSelectList = new SelectItemsList();
  medicalCheckForm!: FormGroup;
  medicalCheckId = -1;
  showAddPrescription = false;
  hasPrescriptions = false;
  isNurse = false;

  // Subscriptions
  private nurseSubscription?: Subscription;

  // Modern dependency injection
  private medicalCheckData = inject(MedicalCheckData);
  private uiService = inject(UIService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private diagnosisData = inject(DiagnosisData);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    // Initialize component state from route params
    if (Number(this.route.snapshot.params['id'])) {
      this.medicalCheckId = +this.route.snapshot.params['id'];
    }

    this.nurseSubscription = this.authService.isNurse.subscribe(isNurse => {
      this.isNurse = isNurse;
    });

    this.initForm();
    this.getDiagnoses();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.nurseSubscription?.unsubscribe();
  }

  initForm(): void {
    // Create reactive form using FormBuilder
    this.medicalCheckForm = this.fb.group({
      medicalCheckTypeName: [{ value: '', disabled: true }],
      clinicName: [{ value: '', disabled: true }],
      employeeName: [{ value: '', disabled: true }],
      patientName: [{ value: '', disabled: true }],
      diagnosisId: ['', [Validators.required]],
      appointment: [{ value: new Date(), disabled: true }]
    });

    this.getMedicalCheck();
  }

  getDiagnoses(): void {
    this.isLoading = true;
    this.diagnosisData.GetDiagnosesDropdown()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(diagnoses => {
        this.diagnosisSelectList = diagnoses;
      });
  }

  getMedicalCheck(): void {
    this.isLoading = true;
    this.medicalCheckData.GetMedicalCheckDetails(this.medicalCheckId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({} as MedicalCheckDetails);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(medicalCheck => {
        if (!medicalCheck) return;

        // Update form with medical check details
        this.medicalCheckForm.patchValue({
          clinicName: medicalCheck.clinicName,
          medicalCheckTypeName: medicalCheck.medicalCheckTypeName,
          diagnosisId: medicalCheck.diagnosisId?.toString(),
          employeeName: medicalCheck.employeeName,
          patientName: medicalCheck.patientName,
          appointment: new Date(medicalCheck.appointment)
        });

        this.hasPrescriptions = medicalCheck.hasPrescriptions;

        // Show add prescription button if conditions met
        if (medicalCheck.diagnosisId && medicalCheck.deleted === false && !this.isNurse) {
          this.showAddPrescription = true;
        }

        // Disable form if medical check is deleted or user is nurse
        if (medicalCheck.deleted || this.isNurse) {
          this.isDeleted = true;
          this.medicalCheckForm.disable();
        }
      });
  }

  onSubmit(): void {
    if (this.medicalCheckForm.invalid) return;

    this.isLoading = true;
    this.updateMedicalCheck();
  }

  updateMedicalCheck(): void {
    const diagnosisId = this.medicalCheckForm.value.diagnosisId;
    if (!diagnosisId) {
      this.uiService.showErrorSnackbar('Diagnosis is required', undefined, 3000);
      this.isLoading = false;
      return;
    }

    const updateMedicalCheckCommand: UpdateMedicalCheckCommand = {
      id: this.medicalCheckId,
      diagnosisId: +diagnosisId
    };

    this.medicalCheckData.UpdateMedicalCheck(updateMedicalCheckCommand)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(result => {
        if (!result) return;

        this.uiService.showSuccessSnackbar(result.successMessage, undefined, 3000);
        this.getMedicalCheck();
      });
  }

  deleteMedicalCheck(): void {
    this.isLoading = true;

    this.medicalCheckData.DeleteMedicalCheck(this.medicalCheckId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(result => {
        if (!result) return;

        this.uiService.showSuccessSnackbar(result.successMessage, undefined, 3000);
        this.goBack();
      });
  }

  goBack(): void {
    this.location.back();
  }
}