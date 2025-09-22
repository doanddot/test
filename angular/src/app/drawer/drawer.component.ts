import { AsyncPipe } from "@angular/common";
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnDestroy,
  ViewChild
} from "@angular/core";
import { fromEvent, ReplaySubject, startWith, Subject, takeUntil, tap } from "rxjs";

import { MatIconButton } from "@angular/material/button";
import { MatDrawer, MatDrawerMode, MatSidenavModule } from "@angular/material/sidenav";
import { MatIcon } from "@angular/material/icon";

import { DrawerToggleButtonDirective } from "./drawer-toggle-button.directive";


@Component({
  selector: 'app-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styles: `
    .drawer {      
      &__title {
        height: 48px;
        padding: 20px 24px 0;
      }
    }
  `,
  template: `
    <mat-drawer-container [hasBackdrop]="hasBackdrop$ | async">
      @if (mode$ | async; as mode) {
        <mat-drawer class="drawer" #drawer [mode]="mode" [position]="position">
          <div class="drawer__title align-items-center d-flex justify-content-end">
            <button mat-icon-button (click)="drawer.close()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <ng-content select="[drawer]"></ng-content>
        </mat-drawer>
      }
      <mat-drawer-content>
        <ng-content></ng-content>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  imports: [
    AsyncPipe,

    MatIcon,
    MatIconButton,
    MatSidenavModule,
  ]
})
export class DrawerComponent implements AfterContentInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  @Input() position: "start" | "end" = "start";

  @ContentChild(DrawerToggleButtonDirective) private toggleButton: DrawerToggleButtonDirective;
  @ViewChild(MatDrawer) private matDrawer: MatDrawer;

  protected hasBackdrop$ = new ReplaySubject<boolean>(1);
  protected mode$ = new ReplaySubject<MatDrawerMode>(1);

  constructor() {
    fromEvent(window, 'resize').pipe(
      startWith(null),
      tap(() => {
        this.hasBackdrop$.next(innerWidth < 1200);
        this.mode$.next(innerWidth < 1200 ? 'over' : 'side')
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngAfterContentInit(): void {
    if (this.toggleButton) {
      this.toggleButton.toggle.pipe(
        tap(() => {
          this.matDrawer.toggle();
        }),
        takeUntil(this.destroy$)
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}