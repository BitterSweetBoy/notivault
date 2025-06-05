import { inject, Injectable } from '@angular/core';
import { CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { map, catchError, of, Observable } from 'rxjs';

export const privateGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const { loggedIn } = authService.authState(); 

  if (loggedIn) {
    return true;
  } else {
    return router.createUrlTree(['/auth/login']);
  }

};