import { inject } from "@angular/core";
import { Route } from '@angular/router';

import { ApiError, BooksService, RolesService, UsersService } from "@app/shared/data-access";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


export const shellRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./shell.component').then(c => c.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'me',
        pathMatch: 'full',
      },
      {
        path: 'me',
        loadComponent: () => import('./me/me.component').then(c => c.MeComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./users/user-list/user-list.component').then(c => c.UserListComponent),
        resolve: {
          users: () => {
            const matSnackBar = inject(MatSnackBar);

            return inject(UsersService).getUsers().pipe(
              catchError((err: ApiError) => {
                matSnackBar.open(JSON.stringify(err.body), "OK", { duration: 10000 });

                return throwError(() => err);
              }),
            )
          }
        }
      },
      {
        path: 'books',
        loadComponent: () => import('./books/book-list/book-list.component').then(c => c.BookListComponent),
        resolve: {
          books: () => {
            const matSnackBar = inject(MatSnackBar);

            return inject(BooksService).getBooks().pipe(
              catchError((err: ApiError) => {
                matSnackBar.open(JSON.stringify(err.body), "OK", { duration: 10000 });

                return throwError(() => err);
              }),
            )
          }
        }
      },
      {
        path: 'roles',
        loadComponent: () => import('./roles/role-list/role-list.component').then(c => c.RoleListComponent),
        resolve: {
          roles: () => {
            const matSnackBar = inject(MatSnackBar);

            return inject(RolesService).getRoles().pipe(
              catchError((err: ApiError) => {
                matSnackBar.open(JSON.stringify(err.body), "OK", { duration: 10000 });

                return throwError(() => err);
              }),
            )
          }
        }
      },
    ]
  },
];
