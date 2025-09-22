import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatProgressBar } from "@angular/material/progress-bar";

import { ApiError, TokenGrantType, AuthService, OpenAPI, UsersService, UserRegister } from "@app/shared/data-access";
import { BehaviorSubject, ReplaySubject, switchMap, take, tap, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { CookieService } from "@app/shared";
import { decodeJwt, getMaxAge, getTimestampInSeconds } from "@app/utils";
import { UserService } from "@app/core";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-sign-in',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'sign-up.component.scss',
  templateUrl: 'sign-up.component.html',
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
export class SignUpComponent {

  protected get surname(): FormControl {
    return this.formGroup.controls.surname;
  }

  protected get name(): FormControl {
    return this.formGroup.controls.name;
  }

  protected get email(): FormControl {
    return this.formGroup.controls.email;
  }

  protected get password(): FormControl {
    return this.formGroup.controls.password;
  }

  protected get confirmPassword(): FormControl {
    return this.formGroup.controls.confirmPassword;
  }

  protected formGroup = new FormGroup({
    surname: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  protected success$  = new BehaviorSubject<boolean>(false);
  private set success(value: boolean) {
    this.success$.next(value);
  }

  protected loading$ = new BehaviorSubject<boolean>(false);
  private set loading(value: boolean) {
    this.loading$.next(value)
  }

  protected visibility = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,

    private authService: AuthService,
    private cookieService: CookieService,
    private userService: UserService,
    private usersService: UsersService,
  ) {

  }

  protected submit(): void {
    this.password.updateValueAndValidity();
    this.confirmPassword.updateValueAndValidity();

    if (this.password.value === this.confirmPassword.value) {
      this.loading = true;
      this.authService.postAuthSignUp(this.formGroup.value as UserRegister).pipe(
        take(1),
        tap(() => {
          this.loading = false;
          this.success = true;
        }),
        catchError((err: ApiError) => {
          this.loading = false;

          return throwError(() => err);
        }),
      ).subscribe();
    } else {
      this.password.setErrors({ equal: 'Пароли не совпадают' });
      this.confirmPassword.setErrors({ equal: 'Пароли не совпадают' });
    }
  }

}