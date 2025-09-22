import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, forkJoin, Observable, of, Subject, switchMap, takeUntil, tap } from "rxjs";

import { DrawerComponent } from "@app/drawer";
import { RailService } from "@app/rail";
import { RolePublic, RolesService } from "@app/shared";

import { AsyncPipe } from '@angular/common';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';


@Component({
  selector: 'app-role-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'role-list.component.scss',
  templateUrl: 'role-list.component.html',
  imports: [
    MatCard,
    MatTableModule,

    DrawerComponent,
    AsyncPipe,
  ]
})
export class RoleListComponent implements AfterViewInit, OnInit,OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  protected columns = ['id', 'name'];
  protected roles$ = new BehaviorSubject<RolePublic[]>([]);

  constructor(
    private activatedRoute: ActivatedRoute,

    private matDialog: MatDialog,

    private railService: RailService,

    private rolesService: RolesService,
  ) {
    const { roles } = this.activatedRoute.snapshot.data;

    this.roles$.next(roles);
  }

  ngOnInit(): void {
    this.railService.tooltip = 'Добавить книгу';
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

  protected openDialog(roleId?: number): void {
    const sources$: Observable<any>[] = [];

    sources$.push(roleId ? this.rolesService.getRolesRoleId(roleId) : of(null))

    forkJoin(sources$).pipe(
      switchMap(([role]) => {
        const dialogRef = this.matDialog.open(
          RoleDialogComponent,
          {
            autoFocus: false,
            data: { role },
            width: '560px'
          }
        );

        return dialogRef.afterClosed();
      }),
      switchMap(() => this.rolesService.getRoles()),
      tap((roles) => {
        this.roles$.next(roles);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
}
