import { ChangeDetectionStrategy, Component } from "@angular/core";

import { MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";

import { RailService } from "./rail.service";
import { ReplaySubject } from "rxjs";
import { AsyncPipe } from "@angular/common";


@Component({
  selector: 'app-rail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styles: `
    @use '@angular/material' as mat;
    
    
    .rail {
      background-color: var(--mat-sys-background);
      bottom: 0;
      height: 80px;
      padding: 0 8px;
      row-gap: 40px;
      width: 100%;
      z-index: 1;

      overflow-x: -moz-scrollbars-none;
      scrollbar-width: none;

      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }


      @media (min-width: 600px) {
        flex-direction: column;
        height: 100%;
        order: -1;
        padding: 56px 0;
        position: fixed;
        left: 0;
        width: 80px;
        max-width: 80px;
        min-width: 80px;
        z-index: 4;
      }
    }

    .rail-button {
      position: fixed;
      
      bottom: calc(80px + 16px);
      right: 16px;
      
      @include mat.fab-overrides((
        container-elevation-shadow: 0,
        focus-container-elevation-shadow: 0,
        hover-container-elevation-shadow: 0,
        pressed-container-elevation-shadow: 0
      ));
      
      @media (min-width: 600px) {
        position: relative;
        
        bottom: unset;
        right: unset;
      }
    }

    .rail-list {
      column-gap: 8px;

      @media (min-width: 600px) {
        flex-direction: column;
        row-gap: 12px;
      }
    }
  `,
  template: `
    <div class="rail align-items-center d-flex overflow-auto position-sticky">
      <button
          mat-fab
          class="rail-button"
          (click)="click()"
          [matTooltip]="tooltip$ | async"
          [disabled]="!(tooltip$ | async)"
          matTooltipPosition="right"
      >
        <mat-icon>add</mat-icon>
      </button>
      <div class="rail-list d-flex justify-content-space-between w-100">
        <ng-content select="[app-rail-item]"></ng-content>
      </div>
    </div>
  `,
  imports: [
    AsyncPipe,

    MatFabButton,
    MatIcon,
    MatTooltip,
  ]
})
export class RailComponent {

  protected tooltip$: ReplaySubject<string>;

  constructor(
    private railService: RailService
  ) {
    this.tooltip$ = this.railService.tooltip$;
  }

  protected click() {
    this.railService.click$.next();
  }

}