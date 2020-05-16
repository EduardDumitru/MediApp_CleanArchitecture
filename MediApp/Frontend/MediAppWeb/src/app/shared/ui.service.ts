import { Subject } from 'rxjs'
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UIService {

    constructor(private matSnackbar: MatSnackBar){}

    showSnackbar(message: string, action: string, duration: number) {
        this.matSnackbar.open(message, action, {duration})
    }
}