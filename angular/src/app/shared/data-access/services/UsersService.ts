/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { UserCreate } from '../models/UserCreate';
import type { UserPublic } from '../models/UserPublic';
import type { UserUpdate } from '../models/UserUpdate';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(public readonly http: HttpClient) {}
  /**
   * Read Users Me
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public getUsersMe(): Observable<UserPublic> {
    return __request(OpenAPI, this.http, {
      method: 'GET',
      url: '/users/me',
    });
  }
  /**
   * Delete Users Me
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteUsersMe(): Observable<any> {
    return __request(OpenAPI, this.http, {
      method: 'DELETE',
      url: '/users/me',
    });
  }
  /**
   * Update Users Me
   * @param requestBody
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public patchUsersMe(
    requestBody: UserUpdate,
  ): Observable<UserPublic> {
    return __request(OpenAPI, this.http, {
      method: 'PATCH',
      url: '/users/me',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Read Users
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public getUsers(): Observable<Array<UserPublic>> {
    return __request(OpenAPI, this.http, {
      method: 'GET',
      url: '/users',
    });
  }
  /**
   * Create User
   * @param requestBody
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public postUsers(
    requestBody: UserCreate,
  ): Observable<UserPublic> {
    return __request(OpenAPI, this.http, {
      method: 'POST',
      url: '/users',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Read User
   * @param userId
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public getUsersUserId(
    userId: number,
  ): Observable<UserPublic> {
    return __request(OpenAPI, this.http, {
      method: 'GET',
      url: '/users/{user_id}',
      path: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update User
   * @param userId
   * @param requestBody
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public patchUsersUserId(
    userId: number,
    requestBody: UserUpdate,
  ): Observable<UserPublic> {
    return __request(OpenAPI, this.http, {
      method: 'PATCH',
      url: '/users/{user_id}',
      path: {
        'user_id': userId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete User
   * @param userId
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public deleteUsersUserId(
    userId: number,
  ): Observable<UserPublic> {
    return __request(OpenAPI, this.http, {
      method: 'DELETE',
      url: '/users/{user_id}',
      path: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
