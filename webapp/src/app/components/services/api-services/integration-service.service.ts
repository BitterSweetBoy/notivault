import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IntegrationServices } from '../../../shared/models/integration-services.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.API_URL}/integration-services`;

  readonly servicios = signal<IntegrationServices[]>([]);

  getIntegrationServices(): Observable<IntegrationServices[]>{
    return this.http.get<IntegrationServices[]>(this.baseUrl).pipe(
      tap((data) => {
        this.servicios.set(data)
      })
    )
  }

}
