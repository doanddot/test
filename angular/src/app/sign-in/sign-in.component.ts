import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";

import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatProgressBar } from "@angular/material/progress-bar";

import { ApiError, TokenGrantType, AuthService, OpenAPI, UsersService } from "@app/shared/data-access";
import { BehaviorSubject, switchMap, take, tap, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { CookieService } from "@app/shared";
import { getMaxAge } from "@app/utils";
import { UserService } from "@app/core";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-sign-in',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'sign-in.component.scss',
  templateUrl: 'sign-in.component.html',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,

    MatButton,
    MatCard,
    MatCardContent,
    MatCheckbox,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressBar,
    RouterLink,
  ]
})
export class SignInComponent {

  protected get email(): FormControl {
    return this.formGroup.controls.email;
  }

  protected get password(): FormControl {
    return this.formGroup.controls.password;
  }

  protected formGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  protected loading$ = new BehaviorSubject<boolean>(false);
  private set loading(value: boolean) {
    this.loading$.next(value)
  }

  protected visibility = false;

  constructor(
    private router: Router,

    private matSnackBar: MatSnackBar,

    private authService: AuthService,
    private cookieService: CookieService,
    private userService: UserService,
    private usersService: UsersService,
  ) {
  }

  protected submit(): void {
    this.email.updateValueAndValidity();
    this.password.updateValueAndValidity();

    if (this.formGroup.valid) {
      this.loading = true;
      this.authService.postAuthToken({
        grant_type: TokenGrantType.CLIENT_CREDENTIALS,
        email: this.email.value,
        password: this.password.value,
      }).pipe(
        take(1),
        switchMap(({ access_token, refresh_token }) => {
          this.cookieService.set("access_token", access_token, { 'max-age': getMaxAge(access_token) });
          this.cookieService.set("refresh_token", refresh_token, { 'max-age': getMaxAge(refresh_token) });

          OpenAPI.TOKEN = access_token;

          return this.usersService.getUsersMe().pipe(
            tap((user) => {
              this.userService.user = user;

              this.router.navigateByUrl('/');
            })
          )
        }),
        catchError((err: ApiError) => {
          this.matSnackBar.open(JSON.stringify(err.body), "OK", { duration: 10000 });

          if (err.status === 401) {
            const { email, password } = err.body.detail;

            if (email) this.email.setErrors({ email })
            if (password) this.password.setErrors({ password })
          }

          this.loading = false;

          return throwError(() => err);
        }),
      ).subscribe();

    }
  }

}