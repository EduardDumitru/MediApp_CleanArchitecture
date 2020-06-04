import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ErrorService {
    constructor() { }

    errorHandl(error) {
        console.log(error);
        let errorMessage = ''
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;

        } else {
          // Get server-side error
            const obj = error.error.errors;
            if(Object.keys(obj).length) {
                Object.keys(obj).forEach(key => {
                    if (obj[key] instanceof Array) {
                        obj[key].forEach((elError: string) => {
                            errorMessage += elError + '\n';
                        });
                    } else if (obj instanceof Array) {
                        obj.forEach((elError: string) => {
                            errorMessage += elError + '\n';
                        });
                    }
                });
            }
        }
        console.log(errorMessage);
        return throwError(errorMessage);
     }
}