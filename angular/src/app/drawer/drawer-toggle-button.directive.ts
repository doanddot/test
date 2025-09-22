import { Directive, EventEmitter, HostListener, Output } from "@angular/core";


@Directive({
  selector: '[app-drawer-toggle-button]',
  standalone: true,
  host: {
    '(click)': 'this.toggle.emit()'
  }
})
export class DrawerToggleButtonDirective {

  @Output() toggle = new EventEmitter<void>();

}