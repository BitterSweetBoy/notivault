import { inject, Injectable } from '@angular/core';
import { CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { map, catchError, of, Observable } from 'rxjs';

export const privateGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verifySession().pipe(
    map(() => {
      // 200 OK en /validate → sesión válida → permitimos el acceso
      return true;
    }),
    catchError(() => {
      // cualquier error (401/emergente) → redirigir a /auth/login
      router.navigateByUrl('/auth/login')
      return of(false);
    })
  );
};

