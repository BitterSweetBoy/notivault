import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [publicGuard],
        loadChildren: () => import('./auth/auth.routes')
    },
    {
        path: 'dashboard',
        canActivate:  [privateGuard],
        loadComponent: () => import('./components/dahsboard/dahsboard.component'),
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
