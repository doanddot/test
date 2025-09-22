/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { RoleCreate } from '../models/RoleCreate';
import type { RolePublic } from '../models/RolePublic';
import type { RoleUpdate } from '../models/RoleUpdate';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(public readonly http: HttpClient) {}
  /**
   * Read Roles
   * @returns RolePublic Successful Response
   * @throws ApiError
   */
  public getRoles(): Observable<Array<RolePublic>> {
    return __request(OpenAPI, this.http, {
      method: 'GET',
      url: '/roles',
    });
  }
  /**
   * Create Role
   * @param requestBody
   * @returns RolePublic Successful Response
   * @throws ApiError
   */
  public postRoles(
    requestBody: RoleCreate,
  ): Observable<RolePublic> {
    return __request(OpenAPI, this.http, {
      method: 'POST',
      url: '/roles',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Read Role
   * @param roleId
   * @returns RolePublic Successful Response
   * @throws ApiError
   */
  public getRolesRoleId(
    roleId: number,
  ): Observable<RolePublic> {
    return __request(OpenAPI, this.http, {
      method: 'GET',
      url: '/roles/{role_id}',
      path: {
        'role_id': roleId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Role
   * @param roleId
   * @param requestBody
   * @returns RolePublic Successful Response
   * @throws ApiError
   */
  public putRolesRoleId(
    roleId: number,
    requestBody: RoleUpdate,
  ): Observable<RolePublic> {
    return __request(OpenAPI, this.http, {
      method: 'PUT',
      url: '/roles/{role_id}',
      path: {
        'role_id': roleId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Role
   * @param roleId
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteRolesRoleId(
    roleId: number,
  ): Observable<any> {
    return __request(OpenAPI, this.http, {
      method: 'DELETE',
      url: '/roles/{role_id}',
      path: {
        'role_id': roleId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
