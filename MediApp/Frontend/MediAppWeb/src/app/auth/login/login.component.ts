import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/@core/services/user.service';
import { LoginUserCommand, UserData } from 'src/app/@core/data/userclasses/user';
import { AuthSuccessResponse, AuthFailedResponse } from 'src/app/@core/data/common/authresponse';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;
    isLoading = false;
    authChangeSubscription: Subscription;
    constructor(private userData: UserData, private authService: AuthService, private router: Router, private uiService: UIService) {}

    ngOnInit() : void {
        this.authChangeSubscription = this.authService.authChange.subscribe((authChange: boolean) => {
            if (authChange === true) {
                this.router.navigate(['']);
            } else {
                this.initForm();
            }
        })
     }

    initForm() {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        })
    }
    login() {
        this.isLoading = true;
        if (this.loginForm.valid) {
            const loginUser: LoginUserCommand = new LoginUserCommand();
            loginUser.email = this.loginForm.value.email;
            loginUser.password = this.loginForm.value.password;
            this.userData.LoginUser(loginUser).subscribe((res: AuthSuccessResponse) => {
                this.isLoading = false;
                this.authService.setToken(res.token)
                this.authService.initAuthListener();
                this.router.navigate(['']);

            }, error => {
                this.isLoading = false;
                this.uiService.showErrorSnackbar(error, null, 3000);
            })
        } else {
            this.isLoading = false;
            this.uiService.showErrorSnackbar('Login form is not valid', null, 3000);
        }
    }

    ngOnDestroy() : void {
        this.authChangeSubscription.unsubscribe();
    }
}
