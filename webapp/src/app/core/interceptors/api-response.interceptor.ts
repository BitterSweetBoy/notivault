import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';

export const ApiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(evt => {
      if (evt instanceof HttpResponse) {
        const contentType = evt.headers.get('Content-Type') || '';
        if (contentType.includes('application/json') && evt.body != null) {
          const body = evt.body as any;
          if (
            typeof body.success === 'boolean' &&
            'data' in body &&
            'message' in body &&
            'errors' in body
          ) {
            if (!body.success) {
              throw {
                name: 'ApiError',
                message: body.message || 'Error en la API',
                payload: body.errors,
                status: evt.status,
              };
            }
            return evt.clone({ body: body.data });
          }
        }
      }
      return evt;
    }),
    catchError(err => throwError(() => err))
  );
};
