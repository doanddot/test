import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { authInterceptor, CanActivateShell, UserService } from '@app/core';
import { CookieService, OpenAPI, UserPublic, UsersService } from '@app/shared';

import { appRoutes } from './app.routes';
import { Observable, tap } from 'rxjs';

OpenAPI.BASE = 'http://localhost:8000';


function initializeApp(): Observable<UserPublic> | void {
  const cookieService = inject(CookieService);
  OpenAPI.TOKEN = cookieService.get('access_token');
  if (cookieService.get('refresh_token')) {
    const userService = inject(UserService);
    return inject(UsersService).getUsersMe().pipe(
      tap((user) => { userService.user = user })
    )
  }
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(appRoutes),
    provideZoneChangeDetection({ eventCoalescing: true }),

    {
      provide: APP_INITIALIZER,
      useValue: initializeApp,
      multi: true
    },

    CanActivateShell,
    CookieService,
    UserService,
  ]
};
