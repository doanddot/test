import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButton } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { iif, Subject, takeUntil, tap, throwError } from "rxjs";
import { ApiError, RoleCreate, RolePublic, RolesService, RoleUpdate, ScopeName } from '@app/shared';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-role-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'role-dialog.component.scss',
  templateUrl: 'role-dialog.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,

    MatAutocompleteModule,
    MatChipsModule,
    MatButton,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInput,
    MatSelectModule,
  ]
})
export class RoleDialogComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  protected roleId: number;
  protected roles: RolePublic[];

  protected scopes: ScopeName[] = Object.values(ScopeName);

  protected roleForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    scopes: new FormControl<string[] | []>([], Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private matDialogData: { role?: RolePublic },
    private matDialogRef: MatDialogRef<RoleDialogComponent>,
    private matSnackBar: MatSnackBar,

    private rolesService: RolesService,
  ) {
    const role = this.matDialogData.role;
    if (role) {
      this.roleId = role.id;
      this.roleForm.patchValue(role);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected save(): void {
    if (this.roleForm.valid) {
      iif(
        () => !!this.roleId,
        this.rolesService.putRolesRoleId(this.roleId, this.roleForm.value as RoleUpdate),
        this.rolesService.postRoles(this.roleForm.value as RoleCreate)
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

    this.roleForm.markAllAsTouched();
  }
}
