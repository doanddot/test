import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { EMPTY, Observable, switchMap, tap, throwError } from "rxjs";

import { CookieService } from "@app/shared";
import { TokenGrantType, AuthService, OpenAPI, ApiError } from "@app/shared/data-access";
import { decodeJwt, getMaxAge, getTimestampInSeconds } from "@app/utils";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {

  const router = inject(Router)

  const authService = inject(AuthService);
  const cookieService = inject(CookieService);

  if (req.url.includes('/auth/token') && JSON.parse(req.body).grant_type === TokenGrantType.REFRESH_TOKEN) {
    return next(req).pipe(
      catchError((apiError: ApiError) => {
        if (apiError.status === 401) {
          cookieService.delete('access_token');
          cookieService.delete('refresh_token');

          router.navigateByUrl('/signin').then();

          return EMPTY;
        }

        return throwError(apiError);
      })
    )
  }

  if (req.url.includes('/auth/revoke')) {
    return next(req).pipe(
      catchError(() => EMPTY),
      tap(() => {
        cookieService.delete('access_token');
        cookieService.delete('refresh_token');

        router.navigateByUrl('/signin').then();
      })
    )
  }

  if (req.url.includes('/auth/forgot_password') || req.url.includes('/auth/reset_password')) {
    return next(req);
  }

  const accessToken = cookieService.get('access_token');
  const refreshToken = cookieService.get('refresh_token');

  if (accessToken) {
    const exp = decodeJwt(accessToken).exp;
    const timestamp = getTimestampInSeconds()

    if (timestamp >= exp) {
      cookieService.delete('access_token');
    } else {
      OpenAPI.TOKEN = accessToken;
    }
  } else if (refreshToken) {
    const exp = decodeJwt(refreshToken).exp;
    const timestamp = getTimestampInSeconds()

    if (timestamp >= exp) {
      cookieService.delete('refresh_token');
    } else {
      return authService.postAuthToken({
        grant_type: TokenGrantType.REFRESH_TOKEN,
        refresh_token: refreshToken,
      }).pipe(
        switchMap(({ access_token, refresh_token }) => {
          cookieService.set('access_token', access_token, { 'max-age': getMaxAge(access_token) });
          cookieService.set('refresh_token', refresh_token, { 'max-age': getMaxAge(refresh_token) });

          OpenAPI.TOKEN = access_token;

          return next(req.clone({ setHeaders: { Authorization: `Bearer ${ access_token }` }}));
        })
      )
    }
  }

  return next(req).pipe(
    catchError((apiError: ApiError) => {
      if (apiError.status === 401) {
        cookieService.delete('access_token');

        if (refreshToken) {
          const exp = decodeJwt(refreshToken).exp;
          const timestamp = getTimestampInSeconds()

          if (timestamp >= exp) {
            cookieService.delete('refresh_token');
          } else {
            return authService.postAuthToken({
              grant_type: TokenGrantType.REFRESH_TOKEN,
              refresh_token: refreshToken,
            }).pipe(
              switchMap(({ access_token, refresh_token }) => {
                cookieService.set('access_token', access_token, { 'max-age': getMaxAge(access_token) });
                cookieService.set('refresh_token', refresh_token, { 'max-age': getMaxAge(refresh_token) });

                OpenAPI.TOKEN = access_token;

                return next(req.clone({ setHeaders: { Authorization: `Bearer ${ access_token }` }}));
              })
            )
          }
        }

        cookieService.delete('access_token');
        cookieService.delete('refresh_token');

        router.navigateByUrl('/signin').then();

        // return EMPTY;
      }

      return throwError(apiError);
    })
  );
}