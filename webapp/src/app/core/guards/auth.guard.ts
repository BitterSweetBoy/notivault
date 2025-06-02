import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

export const privateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verifySession().pipe(
    map((res: any) => {
      return true; 
    }),
    catchError(() => {
      router.navigate(['/auth/login']); 
      return of(false);
    })
  );
};


export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verifySession().pipe(
    map(() => {
      router.navigate(['/dashboard']); 
      return false;
    }),
    catchError(() => {
      return of(true);
    })
  );
};

