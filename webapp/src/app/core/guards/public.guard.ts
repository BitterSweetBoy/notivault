import { inject } from '@angular/core';
import { CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { map, of, catchError } from 'rxjs';

export const publicGuard: CanActivateFn = (): any => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.authState().loggedIn) {
    return router.createUrlTree(['/dashboard']);
  }
  // Si no está logueado, permite el acceso a rutas públicas
  return of(true);
};
