import { Routes } from '@angular/router';
import { privateGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: '',
    component: LayoutComponent,
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
      {
        path: 'apis',
        canActivate: [privateGuard],
        loadComponent: () =>
          import('./components/dahsboard/dahsboard.component'),
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
