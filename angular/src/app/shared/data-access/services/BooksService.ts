/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { BookCreate } from '../models/BookCreate';
import type { BookPublic } from '../models/BookPublic';
import type { BookUpdate } from '../models/BookUpdate';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(public readonly http: HttpClient) {}
  /**
   * Read Books
   * @returns BookPublic Successful Response
   * @throws ApiError
   */
  public getBooks(): Observable<Array<BookPublic>> {
    return __request(OpenAPI, this.http, {
      method: 'GET',
      url: '/books',
    });
  }
  /**
   * Create Books
   * @param requestBody
   * @returns BookPublic Successful Response
   * @throws ApiError
   */
  public postBooks(
    requestBody: BookCreate,
  ): Observable<BookPublic> {
    return __request(OpenAPI, this.http, {
      method: 'POST',
      url: '/books',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Read Book
   * @param bookId
   * @returns BookPublic Successful Response
   * @throws ApiError
   */
  public getBooksBookId(
    bookId: number,
  ): Observable<BookPublic> {
    return __request(OpenAPI, this.http, {
      method: 'GET',
      url: '/books/{book_id}',
      path: {
        'book_id': bookId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Books
   * @param bookId
   * @param requestBody
   * @returns BookPublic Successful Response
   * @throws ApiError
   */
  public patchBooksBookId(
    bookId: number,
    requestBody: BookUpdate,
  ): Observable<BookPublic> {
    return __request(OpenAPI, this.http, {
      method: 'PATCH',
      url: '/books/{book_id}',
      path: {
        'book_id': bookId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Books
   * @param bookId
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteBooksBookId(
    bookId: number,
  ): Observable<any> {
    return __request(OpenAPI, this.http, {
      method: 'DELETE',
      url: '/books/{book_id}',
      path: {
        'book_id': bookId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
