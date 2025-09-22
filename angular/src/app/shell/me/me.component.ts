import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '@app/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { ApiError, RolePublic, UsersService } from '@app/shared';
import { DrawerComponent } from '@app/drawer';
import { MatButton } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { filter, switchMap, take, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShellService } from '../shell.service';
import { RailService } from '@app/rail';


@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle
  ],
  template: `
    <h2 mat-dialog-title>Удаление пользователя</h2>
    <mat-dialog-content>
      <p>Вы действительно хотите удалить пользователя?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Нет</button>
      <button mat-raised-button color="primary" (click)="onYesClick()">Да</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}


@Component({
  selector: 'app-me',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'me.component.scss',
  templateUrl: 'me.component.html',
  imports: [
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    DrawerComponent,
    MatButton,
  ]
})
export class MeComponent implements OnInit {

  protected roles: RolePublic[] = [];

  protected formGroup = new FormGroup({
    email: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.minLength(8)),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
  })

  constructor(
    private activatedRoute: ActivatedRoute,

    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,

    private railService: RailService,
    private shellService: ShellService,
    private userService: UserService,
    private usersService: UsersService,
  ) {
    this.formGroup.patchValue(userService.user);
  }

  ngOnInit() {
    this.railService.tooltip = '';
  }

  save() {
    this.usersService.patchUsersMe(this.formGroup.value).pipe(
      take(1),
      tap(() => {
        this.matSnackBar.open('Изменения сохранены', "OK", { duration: 10000 });
      }),
      catchError((err: ApiError) => {
        this.matSnackBar.open(JSON.stringify(err.body), "OK", { duration: 10000 });

        return throwError(() => err);
      }),
    ).subscribe()
  }

  delete() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, { width: '300px' });

    dialogRef.afterClosed().pipe(
      take(1),
      filter(result => !!result),
      switchMap(() => this.usersService.deleteUsersMe()),
      tap(() => {
        this.shellService.logout();
      })
    ).subscribe();
  }

}