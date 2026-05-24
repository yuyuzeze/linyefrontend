import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApplicationTypeDto {
  id: number;
  code: string;
  name: string;
  description: string | null;
  displayOrder: number;
}

@Injectable({ providedIn: 'root' })
export class ApplicationTypeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/application-types`;

  getAllTypes(): Observable<ApplicationTypeDto[]> {
    return this.http.get<ApplicationTypeDto[]>(this.baseUrl);
  }

  mapRow(typeId: number, values: string[]): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`${this.baseUrl}/${typeId}/map-row`, {
      values
    });
  }
}
