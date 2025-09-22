import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { CookieService } from '@app/shared';


@Injectable()
export class CanActivateShell implements CanActivate {

  constructor(
    private router: Router,

    private cookieService: CookieService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const refreshToken = this.cookieService.get('refresh_token');

    if (!(state.url.includes('signin') || state.url.includes('signup')) && !refreshToken) {
      this.router.navigateByUrl('/signin');

      return true;
    }

    if ((state.url.includes('signin') || state.url.includes('signup')) && !!refreshToken) {
      this.router.navigateByUrl('/');

      return false;
    }

    return true;
  }
}
