import { inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

/**
 * Esta función se ejecutará al inicio de la app y debe devolver
 * una Promise<void> o un Observable que complete (para bloquear
 * el arranque hasta que termine la verificación).
 */
export function initializeSession(): Promise<void> {
  // inyectamos AuthService “en sitio”
  const authService = inject(AuthService);
  // verifySessionOnce() ya está diseñado para devolver Promise<void>
  return authService.verifySessionOnce();
}
