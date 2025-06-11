import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import {
  ApiToken,
  CreateApiTokenDto,
  UpdateApiTokenDto,
} from '../../../shared/models/api-token.model';
import { ApiResponse } from '../../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.API_URL}/api-tokens`;

  readonly tokens = signal<ApiToken[]>([]);

  /** Carga todos los tokens y actualiza la señal */
  getApiTokens(): Observable<ApiToken[]> {
    return this.http
      .get<ApiToken[]>(this.baseUrl) 
      .pipe(
        tap((data) => {
          console.log(data); 
          this.tokens.set(data);
        })
      );
  }

  /** Crea un token y lo añade a la señal */
  createApiToken(dto: CreateApiTokenDto): Observable<ApiToken> {
    return this.http.post<ApiToken>(this.baseUrl, dto).pipe(
      map((res) => res),
      tap((newToken) => this.tokens.update((current) => [newToken, ...current]))
    );
  }

  updateApiToken( id: string, dto: UpdateApiTokenDto): Observable<ApiToken> {
    return this.http.patch<ApiToken>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(updated =>
        this.tokens.update(list =>
          list.map(t => (t.id === updated.id ? updated : t))
        )
      )
    );
  }

  /** Desactiva (soft‑delete) un token y lo elimina de la señal */
  deleteApiToken(id: string): Observable<null> {
  return this.http
    .delete<null>(`${this.baseUrl}/${id}`)
    .pipe(
      tap(() =>
        this.tokens.update(list => list.filter(t => t.id !== id))
      )
    );
}
}