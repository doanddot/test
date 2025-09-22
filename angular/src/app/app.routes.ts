import { Routes } from '@angular/router';

import { CanActivateShell } from '@app/core';


export const appRoutes: Routes = [
  {
    path: 'signup',
    loadComponent: () => import('./sign-up/sign-up.component').then(c => c.SignUpComponent),
    canActivate: [CanActivateShell]
  },
  {
    path: 'signin',
    loadComponent: () => import('./sign-in/sign-in.component').then(c => c.SignInComponent),
    canActivate: [CanActivateShell]
  },
  {
    path: '',
    loadChildren: () => import('./shell/shell.routes').then(r => r.shellRoutes),
    canActivate: [CanActivateShell]
  }
];
