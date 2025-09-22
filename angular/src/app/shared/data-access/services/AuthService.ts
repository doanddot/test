/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { TokenObtain } from '../models/TokenObtain';
import type { TokenPair } from '../models/TokenPair';
import type { TokenRefresh } from '../models/TokenRefresh';
import type { TokenRevoke } from '../models/TokenRevoke';
import type { UserPublic } from '../models/UserPublic';
import type { UserRegister } from '../models/UserRegister';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public readonly http: HttpClient) {}
  /**
   * Sign Up
   * @param requestBody
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public postAuthSignUp(
    requestBody: UserRegister,
  ): Observable<UserPublic> {
    return __request(OpenAPI, this.http, {
      method: 'POST',
      url: '/auth/sign-up',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Token Pair
   * @param requestBody
   * @returns TokenPair Successful Response
   * @throws ApiError
   */
  public postAuthToken(
    requestBody: (TokenObtain | TokenRefresh),
  ): Observable<TokenPair> {
    return __request(OpenAPI, this.http, {
      method: 'POST',
      url: '/auth/token',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Revoke Token
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public postAuthRevoke(
    requestBody: TokenRevoke,
  ): Observable<any> {
    return __request(OpenAPI, this.http, {
      method: 'POST',
      url: '/auth/revoke',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
