import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { register } from '../interfaces/registerDTO';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthState } from '../interfaces/authStateInterface';
import { login } from '../interfaces/loginDTO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  apiUrl = environment.API_URL;
  public authState = signal<AuthState>({ loggedIn: false });

  login(user: login): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, user).pipe(
      tap(
        (res: any) => {
          this.authState.set({ loggedIn: true, user: res.user });
        },
        (error) => {
          this.authState.set({ loggedIn: false });
          return throwError(() => new Error('Error en el login'));
        }
      )
    );
  }

  register(user: register): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((res) => {
        this.authState.set({ loggedIn: true });
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(
        () => {
          this.authState.set({ loggedIn: false });
        },
        () => {
          console.log('Error en logout');
        }
      )
    );
  }

  verifySession(): Observable<boolean> {
    return this.http.get<string>(`${this.apiUrl}/auth/validate`).pipe(
      tap((res: string) => {
        this.authState.set({ loggedIn: true });
      }),
      map(() => {
        return true;
      }),
      catchError((err) => {
        console.log('ERROR AL VALIDAR LA SESSION');
        this.authState.set({ loggedIn: false });
        return throwError(() => err);
      })
    );
  }
}
