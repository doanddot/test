import { ChangeDetectionStrategy, Component } from "@angular/core";


@Component({
  selector: '[app-rail-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styles: `
    :host {
      color: var(--mat-sys-on-surface-variant);
      flex: 1;

      .rail-item {
        &__container {
          color: var(--mat-sys-on-surface-variant);
          padding: 12px 0 16px;
          row-gap: 4px;
          
          @media (min-width: 600px) {
            padding: 0 0 4px;
          }
        }
        
        &__icon-wrapper {
          border-radius: var(--mat-sys-corner-large);
          height: 32px;
          width: 64px;
        }

        &__icon-wrapper::before,
        &__icon-wrapper::after {
          content: '';
          position: absolute;
          opacity: 0;

          height: 100%;
          width: 100%;
          
          transition: opacity 15ms linear 30ms;
        }
        
        &__icon-wrapper:before {
          background-color: var(--mat-sys-on-surface);
          z-index: 2;
        }
        
        &__icon-wrapper::after {
          background-color: var(--mat-sys-secondary-container);
          z-index: 1;
        }
        
        &__icon {
          z-index: 3;
        }

        &__label {
          font-size: 12px;
          font-weight: 600;
          line-height: 16px;
          
          @media (min-width: 600px) {
            font-size: 11px;
            letter-spacing: -0.01em;
          }
        }
      }

      @media (hover) {
        &:hover .rail-item__icon-wrapper::before { opacity: 0.08; }
      }
      &:focus-visible .rail-item__icon-wrapper::before { opacity: 0.12; }
      &:active .rail-item__icon-wrapper::before { opacity: 0.16; }
    }
    
    :host.rail-item_active {
      .rail-item {
        &__container {
          color: var(--mat-sys-on-surface); 
        }
        
        &__icon-wrapper::after {
          opacity: 1;
        }
      }
    }
  `,
  template: `
    <div class="rail-item__container align-items-center d-flex flex-column">
      <div class="rail-item__icon-wrapper align-items-center d-flex justify-content-center overflow-hidden position-relative">
        <div class="rail-item__icon d-flex">
          <ng-content select="mat-icon"></ng-content>
        </div>
      </div>
      <div class="rail-item__label">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class RailItemComponent {

}