import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';

// Services and data
import { LoginUserCommand, UserData } from 'src/app/@core/data/userclasses/user';
import { AuthSuccessResponse } from 'src/app/@core/data/common/authresponse';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm!: FormGroup;
    isLoading = false;

    // Dependency injection using inject function
    private readonly userData = inject(UserData);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly uiService = inject(UIService);
    private readonly fb = inject(FormBuilder);

    // Stream to handle unsubscription
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.authService.authChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((authChange: boolean) => {
                if (authChange === true) {
                    this.router.navigate(['']);
                } else {
                    this.initForm();
                }
            });
    }

    initForm(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    login(): void {
        if (this.loginForm.invalid) {
            this.uiService.showErrorSnackbar('Please enter valid email and password', undefined, 3000);
            return;
        }

        this.isLoading = true;

        const formValues = this.loginForm.value;
        const loginUser: LoginUserCommand = {
            email: formValues.email,
            password: formValues.password
        };

        this.userData.LoginUser(loginUser)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: AuthSuccessResponse | null) => {
                if (!res) return;

                this.authService.setToken(res.token);
                this.authService.initAuthListener();
                this.router.navigate(['']);
            });
    }

    ngOnDestroy(): void {
        // Clean up all subscriptions at once
        this.destroy$.next();
        this.destroy$.complete();
    }
}