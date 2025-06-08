import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    PrescriptionData,
    PrescriptionDetails,
    EmployeePrescriptionsList,
    PatientPrescriptionsList,
    AddPrescriptionCommand,
    UpdatePrescriptionCommand,
    PrescriptionsByMedicalCheckList
} from '../data/prescription';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class PrescriptionService extends PrescriptionData {
    private readonly baseUrl = `${environment.baseURL}Prescription`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific prescription
     * @param id Prescription ID
     * @returns Observable with prescription details
     */
    override GetPrescriptionDetails(id: number): Observable<PrescriptionDetails> {
        return this.http.get<PrescriptionDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<PrescriptionDetails>('GetPrescriptionDetails', error, {} as PrescriptionDetails))
        );
    }

    /**
     * Get prescriptions for an employee
     * @param employeeId Employee ID
     * @returns Observable with list of employee prescriptions
     */
    override GetEmployeePrescriptions(employeeId: number): Observable<EmployeePrescriptionsList> {
        return this.http.get<EmployeePrescriptionsList>(
            `${this.baseUrl}/employeeprescriptions/${employeeId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<EmployeePrescriptionsList>('GetEmployeePrescriptions', error, new EmployeePrescriptionsList()))
        );
    }

    /**
     * Get prescriptions for a patient
     * @param patientId Patient ID
     * @returns Observable with list of patient prescriptions
     */
    override GetPatientPrescriptions(patientId: number): Observable<PatientPrescriptionsList> {
        return this.http.get<PatientPrescriptionsList>(
            `${this.baseUrl}/patientprescriptions/${patientId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<PatientPrescriptionsList>('GetPatientPrescriptions', error, new PatientPrescriptionsList()))
        );
    }

    /**
     * Get prescriptions by medical check
     * @param medicalCheckId Medical check ID
     * @returns Observable with list of prescriptions by medical check
     */
    override GetPrescriptionsByMedicalCheck(medicalCheckId: number): Observable<PrescriptionsByMedicalCheckList> {
        return this.http.get<PrescriptionsByMedicalCheckList>(
            `${this.baseUrl}/bymedicalcheck/${medicalCheckId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<PrescriptionsByMedicalCheckList>('GetPrescriptionsByMedicalCheck', error, new PrescriptionsByMedicalCheckList()))
        );
    }

    /**
     * Add a new prescription
     * @param addPrescriptionCommand Prescription data
     * @returns Observable with result
     */
    override AddPrescription(addPrescriptionCommand: AddPrescriptionCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addPrescriptionCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddPrescription', error, null))
        );
    }

    /**
     * Update an existing prescription
     * @param updatePrescriptionCommand Prescription data
     * @returns Observable with result
     */
    override UpdatePrescription(updatePrescriptionCommand: UpdatePrescriptionCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updatePrescriptionCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdatePrescription', error, null))
        );
    }

    /**
     * Delete a prescription
     * @param id Prescription ID
     * @returns Observable with result
     */
    override DeletePrescription(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeletePrescription', error, null))
        );
    }
}