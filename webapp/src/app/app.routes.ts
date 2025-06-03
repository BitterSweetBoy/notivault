import { Routes } from '@angular/router';
import { privateGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        canActivate: [privateGuard],
        loadComponent: () =>
          import('./components/dahsboard/dahsboard.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
