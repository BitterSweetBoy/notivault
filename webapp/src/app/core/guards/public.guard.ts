import { inject } from '@angular/core';
import { CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { map, of, catchError } from 'rxjs';

export const publicGuard: CanActivateFn = (): any => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el estado ya está cargado, usamos el valor actual, si no, verificamos la sesión
  if (authService.authState().loggedIn) {
    return router.createUrlTree(['/dashboard']);
  }

  // Si no está logueado, pero no hay certeza, verificamos la sesión
  return authService.verifySession().pipe(
    map(() => router.createUrlTree(['/dashboard'])),
    // Si la sesión no es válida, permite el acceso
    catchError(() => of(true))
  );
};
