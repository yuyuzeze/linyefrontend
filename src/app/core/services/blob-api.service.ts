import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BlobItemDto {
  name: string;
  isPrefix: boolean;
  lastModified?: string;
  length?: number;
}

export interface BlobListResultDto {
  prefixes: BlobItemDto[];
  items: BlobItemDto[];
}

@Injectable({ providedIn: 'root' })
export class BlobApiService {
  private readonly base = `${environment.apiUrl}/blobs`;

  constructor(private http: HttpClient) {}

  list(container?: string, prefix?: string): Observable<BlobListResultDto> {
    let params = new HttpParams();
    if (container) params = params.set('container', container);
    if (prefix !== undefined && prefix !== null) params = params.set('prefix', prefix);
    return this.http.get<BlobListResultDto>(this.base, { params });
  }

  getContent(container: string | undefined, blobName: string): Observable<Blob> {
    let params = new HttpParams().set('blobName', blobName);
    if (container) params = params.set('container', container);
    return this.http.get(`${this.base}/content`, { params, responseType: 'blob' });
  }
}
