import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrescriptionData, PrescriptionDetails, UpdatePrescriptionCommand, AddPrescriptionCommand } from 'src/app/@core/data/prescription';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { Location } from '@angular/common';
import { MedicalCheckData, MedicalCheckDetails } from 'src/app/@core/data/medicalcheck';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { getSharedImports } from 'src/app/shared/shared.module';
import { PrescriptionXDrugsComponent } from '../../prescriptionxdrug/prescriptionxdrugs/prescriptionxdrugs.component';

@Component({
    selector: 'app-prescription',
    standalone: true,
    imports: [
        ...getSharedImports(),
        PrescriptionXDrugsComponent,
    ],
    templateUrl: './prescription.component.html',
    styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit, OnDestroy {
    isLoading = false;
    prescriptionForm!: FormGroup;
    prescriptionId = 0;
    medicalCheckId = 0;
    medicalCheck!: MedicalCheckDetails;
    isDeleted = false;
    isAdmin = false;
    isDoctor = false;

    private isDoctorSubscription!: Subscription;
    private isAdminSubscription!: Subscription;

    // Modern dependency injection
    private prescriptionData = inject(PrescriptionData);
    private uiService = inject(UIService);
    private route = inject(ActivatedRoute);
    private _location = inject(Location);
    private medicalCheckData = inject(MedicalCheckData);
    private authService = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        if (Number(this.route.snapshot.params['prescriptionId'])) {
            this.prescriptionId = +this.route.snapshot.params['prescriptionId'];
        } else if (Number(this.route.snapshot.params['medicalCheckId'])) {
            this.medicalCheckId = +this.route.snapshot.params['medicalCheckId'];
        }

        this.isAdminSubscription = this.authService.isAdmin.subscribe((isAdmin: boolean) => {
            this.isAdmin = isAdmin;
        });

        this.isDoctorSubscription = this.authService.isDoctor.subscribe((isDoctor: boolean) => {
            this.isDoctor = isDoctor;
        });

        this.initForm();
    }

    ngOnDestroy(): void {
        this.isAdminSubscription?.unsubscribe();
        this.isDoctorSubscription?.unsubscribe();
    }

    initForm(): void {
        this.prescriptionForm = this.fb.group({
            noOfDays: ['', [Validators.required]],
            description: ['', [Validators.required]],
            medicalCheckTypeName: [{ value: '', disabled: true }],
            diagnosisName: [{ value: '', disabled: true }],
            clinicName: [{ value: '', disabled: true }],
            employeeName: [{ value: '', disabled: true }],
            patientName: [{ value: '', disabled: true }]
        });

        if (this.prescriptionId) {
            this.getPrescription();
        } else if (this.medicalCheckId) {
            this.getMedicalCheck();
        }
    }

    getMedicalCheck(): void {
        this.isLoading = true;
        this.medicalCheckData.GetMedicalCheckDetails(this.medicalCheckId)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of(null);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((medicalCheck: MedicalCheckDetails | null) => {
                if (!medicalCheck) return;

                this.medicalCheck = medicalCheck;
                this.prescriptionForm.patchValue({
                    clinicName: medicalCheck.clinicName,
                    medicalCheckTypeName: medicalCheck.medicalCheckTypeName,
                    diagnosisName: medicalCheck.diagnosisName,
                    employeeName: medicalCheck.employeeName,
                    patientName: medicalCheck.patientName
                });
            });
    }

    getPrescription(): void {
        this.isLoading = true;
        this.prescriptionData.GetPrescriptionDetails(this.prescriptionId)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of(null);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((prescription: PrescriptionDetails | null) => {
                if (!prescription) return;

                this.prescriptionForm.setValue({
                    noOfDays: prescription.noOfDays,
                    description: prescription.description,
                    clinicName: prescription.clinicName,
                    medicalCheckTypeName: prescription.medicalCheckTypeName,
                    diagnosisName: prescription.diagnosisName,
                    employeeName: prescription.employeeName,
                    patientName: prescription.patientName
                });

                this.isDeleted = (prescription.deleted || (!prescription.deleted && !this.isAdmin && !this.isDoctor));

                if (this.isDeleted) {
                    this.prescriptionForm.disable();
                }
            });
    }

    onSubmit(): void {
        if (this.prescriptionForm.invalid) return;

        this.isLoading = true;
        if (this.prescriptionId) {
            this.updatePrescription();
        } else {
            this.addPrescription();
        }
    }

    updatePrescription(): void {
        const updatePrescriptionCommand: UpdatePrescriptionCommand = {
            id: this.prescriptionId,
            noOfDays: +this.prescriptionForm.value.noOfDays,
            description: this.prescriptionForm.value.description
        };

        this.prescriptionData.UpdatePrescription(updatePrescriptionCommand)
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
                this._location.back();
            });
    }

    addPrescription(): void {
        if (!this.medicalCheck) {
            this.isLoading = false;
            this.uiService.showErrorSnackbar("Medical check information is missing", undefined, 3000);
            return;
        }

        const addPrescriptionCommand: AddPrescriptionCommand = {
            noOfDays: +this.prescriptionForm.value.noOfDays,
            medicalCheckId: this.medicalCheckId,
            description: this.prescriptionForm.value.description,
            clinicId: this.medicalCheck.clinicId,
            patientId: this.medicalCheck.patientId,
            employeeId: this.medicalCheck.employeeId
        };

        this.prescriptionData.AddPrescription(addPrescriptionCommand)
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
                this.router.navigate(['/treatments/employeeprescriptions/', addPrescriptionCommand.employeeId]);
            });
    }

    deletePrescription(): void {
        this.isLoading = true;
        this.prescriptionData.DeletePrescription(this.prescriptionId)
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
                this._location.back();
            });
    }

    goBack(): void {
        this._location.back();
    }

    /**
    * Handles negative values in number inputs by setting them to 1
    * @param event The input event
    * @param controlName The name of the form control
    */
    handleNegativeValue(event: Event, controlName: string): void {
        const input = event.target as HTMLInputElement;
        const value = Number(input.value);

        if (value < 0) {
            input.value = '1';
            this.prescriptionForm.get(controlName)?.setValue(1);
        }
    }
}