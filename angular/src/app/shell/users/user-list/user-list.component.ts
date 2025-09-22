import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, forkJoin, Observable, of, Subject, switchMap, takeUntil, tap } from "rxjs";

import { DrawerComponent } from "@app/drawer";
import { RailService } from "@app/rail";
import { RolesService, UserPublic, UsersService } from "@app/shared";

import { UserDialogComponent } from "../user-dialog/user-dialog.component";
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'user-list.component.scss',
  templateUrl: 'user-list.component.html',
  imports: [
    MatCard,
    MatTableModule,

    DrawerComponent,
    AsyncPipe,
  ]
})
export class UserListComponent implements AfterViewInit, OnInit,OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  protected columns = ['id', 'email', 'surname', 'name', 'role', 'is_superuser', 'is_active'];
  protected users$ = new BehaviorSubject<UserPublic[]>([]);

  constructor(
    private activatedRoute: ActivatedRoute,

    private matDialog: MatDialog,

    private railService: RailService,
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {
    const { users } = this.activatedRoute.snapshot.data;

    this.users$.next(users);
  }

  ngOnInit(): void {
    this.railService.tooltip = 'Добавить пользователя';
    this.railService.click$.pipe(
      tap(() => {
        this.openDialog();
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected openDialog(userId?: number): void {
    const sources$: Observable<any>[] = [
      this.rolesService.getRoles()
    ];

    if (userId) sources$.push(this.usersService.getUsersUserId(userId))

    forkJoin(sources$).pipe(
      switchMap(([roles, user]) => {
        const dialogRef = this.matDialog.open(
          UserDialogComponent,
          {
            autoFocus: false,
            data: { roles, user },
            width: '560px'
          }
        );

        return dialogRef.afterClosed();
      }),
      switchMap(() => this.usersService.getUsers()),
      tap((users) => {
        this.users$.next(users);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
}
