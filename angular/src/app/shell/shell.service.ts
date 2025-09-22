import { Injectable } from "@angular/core";

import { MatDrawer } from "@angular/material/sidenav";
import { take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, CookieService } from '@app/shared';


@Injectable()
export class ShellService {

  drawer: MatDrawer;

  constructor(
    private router: Router,

    private authService: AuthService,
    private cookieService: CookieService,
  ) {
  }

  logout() {
    const refreshToken = this.cookieService.get('refresh_token');
    if (refreshToken) {
      this.authService.postAuthRevoke({ refresh_token: refreshToken }).pipe(
        take(1),
        tap(() => {
          this.cookieService.delete('access_token');
          this.cookieService.delete('refresh_token');

          this.router.navigateByUrl('/signin');
        })
      ).subscribe();
    }
  }

}