import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { UIService } from './ui.service';

@Injectable({ providedIn: 'root' })
export class ErrorService {
    private readonly uiService = inject(UIService);

    /**
     * Handle HTTP errors and format them for display
     * @param error The HTTP error response
     * @returns Observable with error message
     */
    errorHandl(error: HttpErrorResponse): Observable<Error> {
        const errorMessage = this.formatErrorMessage(error);
        return throwError(() => new Error(errorMessage));
    }

    /**
     * Handle operation errors with proper type safety
     * @param operation - name of the operation that failed
     * @param error - the HTTP error response
     * @param fallbackValue - optional fallback value to return (default: empty object)
     * @returns - safe Observable with the fallback value
     */
    handleError<T>(operation: string, error: HttpErrorResponse, fallbackValue: T = {} as T): Observable<T> {
        const errorMessage = this.formatErrorMessage(error);

        // Log the error with context
        console.error(`${operation} failed:`, error);

        // Show error to user via UI service
        this.uiService.showErrorSnackbar(errorMessage, undefined, 3000);

        // Return a safe observable with fallback value so app doesn't crash
        return of(fallbackValue);
    }

    /**
     * Format error messages from HTTP responses
     * @param error The HTTP error response
     * @returns Formatted error message string
     */
    private formatErrorMessage(error: HttpErrorResponse): string {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
            // Client-side error (network issues, etc)
            errorMessage = `Client Error: ${error.error.message}`;
            console.error('Client-side error:', error.error.message);
        } else {
            // Server-side error
            try {
                if (error.error?.errors) {
                    const errors = error.error.errors;

                    if (typeof errors === 'object' && errors !== null) {
                        // Process object with error arrays
                        Object.entries(errors).forEach(([key, value]) => {
                            if (Array.isArray(value)) {
                                value.forEach((message: string) => {
                                    errorMessage += `${message}\n`;
                                });
                            }
                        });
                    } else if (Array.isArray(errors)) {
                        // Process array of errors directly
                        errors.forEach((message: string) => {
                            errorMessage += `${message}\n`;
                        });
                    }
                } else if (error.status) {
                    // Handle common HTTP status codes
                    switch (error.status) {
                        case 404:
                            errorMessage = 'Resource not found';
                            break;
                        case 403:
                            errorMessage = 'Access forbidden';
                            break;
                        case 401:
                            errorMessage = 'Unauthorized access';
                            break;
                        case 500:
                            errorMessage = 'Server error, please try again later';
                            break;
                        default:
                            errorMessage = `Server Error: ${error.statusText || 'Unknown error'}`;
                    }
                }
            } catch (e) {
                errorMessage = 'An unexpected error occurred';
                console.error('Error parsing server response', e);
            }

            // Log entire error for debugging
            console.error(`Server error (${error.status}):`, error);
        }

        // If we couldn't extract any message, provide a generic one
        if (!errorMessage.trim()) {
            errorMessage = 'An error occurred. Please try again.';
        }

        return errorMessage;
    }
}