import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltip } from "@angular/material/tooltip";
import { iif, Subject, takeUntil, tap, throwError } from "rxjs";
import { ApiError, RolePublic, UserCreate, UserPublic, UsersService, UserUpdate } from '@app/shared';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'user-dialog.component.scss',
  templateUrl: 'user-dialog.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,

    MatAutocompleteModule,
    MatCheckbox,
    MatChipsModule,
    MatButton,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInput,
    MatSelectModule,
    MatIconButton,
    MatTooltip,
  ]
})
export class UserDialogComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  protected userId: number;
  protected roles: RolePublic[];

  protected userForm = new FormGroup({
    email: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.minLength(8)),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    role_id: new FormControl<number | null>(null, Validators.required),
    is_superuser: new FormControl<boolean>(false),
    is_active: new FormControl<boolean>(false)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private matDialogData: { roles: RolePublic[], user?: UserPublic },
    private matDialogRef: MatDialogRef<UserDialogComponent>,
    private matSnackBar: MatSnackBar,

    private usersService: UsersService,
  ) {
    this.roles = this.matDialogData.roles;

    const user = this.matDialogData.user;
    if (user) {
      this.userId = user.id;
      this.userForm.patchValue(user);
      if (user.role?.id) {
        this.userForm.controls.role_id.patchValue(user.role.id);
      }
    } else {
      this.userForm.controls.password.addValidators(Validators.required);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected generatePassword(): void {
    const password = Math.random().toString(36).slice(-8);

    this.userForm.controls.password.setValue(password);
  }

  protected save(): void {
    if (this.userForm.valid) {
      iif(
        () => !!this.userId,
        this.usersService.patchUsersUserId(this.userId, this.userForm.value as UserUpdate),
        this.usersService.postUsers(this.userForm.value as UserCreate)
      ).pipe(
        tap(() => {
          this.matDialogRef.close();
        }),
        catchError((err: ApiError) => {
          this.matSnackBar.open(JSON.stringify(err.body), "OK", { duration: 10000 });

          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      ).subscribe();
    }

    this.userForm.markAllAsTouched();
  }
}
