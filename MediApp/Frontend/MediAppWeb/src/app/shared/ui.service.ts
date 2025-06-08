import { Subject } from 'rxjs'
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UIService {

    constructor(private matSnackbar: MatSnackBar) { }

    showErrorSnackbar(message: string, action: string | undefined, duration: number) {
        this.matSnackbar.open(message, action, { duration, panelClass: ['error-snackbar'] });
    }

    showSuccessSnackbar(message: string, action: string | undefined, duration: number) {
        this.matSnackbar.open(message, action, { duration, panelClass: ['success-snackbar'] });
    }
}