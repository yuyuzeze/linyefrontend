import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BlobItemDto {
  name: string;
  isPrefix: boolean;
  lastModified: string | null;
  length: number | null;
}

export interface BlobListResultDto {
  prefixes: BlobItemDto[];
  items: BlobItemDto[];
}

@Injectable({ providedIn: 'root' })
export class BlobApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/blobs`;

  list(container?: string, prefix?: string): Observable<BlobListResultDto> {
    let params = new HttpParams();
    if (container) {
      params = params.set('container', container);
    }
    if (prefix) {
      params = params.set('prefix', prefix);
    }
    return this.http.get<BlobListResultDto>(this.baseUrl, { params });
  }
}
