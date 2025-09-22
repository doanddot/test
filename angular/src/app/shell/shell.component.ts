import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CdkConnectedOverlay, CdkOverlayOrigin } from "@angular/cdk/overlay";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { take, tap } from "rxjs";

import { MatFabButton, MatIconButton } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";

import { UserService } from "@app/core";
import { RailComponent, RailItemComponent, RailService } from "@app/rail";
import { CookieService } from "@app/shared";
import { AuthService, UserPublic } from "@app/shared/data-access";

import { ShellService } from "./shell.service";



@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: 'shell.component.scss',
  templateUrl: 'shell.component.html',
  imports: [
    CdkConnectedOverlay,
    CdkOverlayOrigin,

    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,

    MatCardModule,
    MatIcon,
    MatIconButton,
    MatToolbar,

    RailComponent,
    RailItemComponent,
    MatFabButton,
  ],
  providers: [
    ShellService,
    RailService,
  ]
})
export class ShellComponent {

  protected user: UserPublic;

  protected railItems = [
    { icon: 'book', routerLink: 'books', label: 'Книги' },
    { icon: 'person', routerLink: 'users', label: 'Пользователи' },
    { icon: 'group', routerLink: 'roles', label: 'Роли' },
  ];

  protected isOpen = false;

  get width() {
    return innerWidth;
  }

  constructor(
    private shellService: ShellService,
    private userService: UserService,
  ) {
    this.user = this.userService?.user;
  }

  protected logout() {
    this.shellService.logout();
  }

}