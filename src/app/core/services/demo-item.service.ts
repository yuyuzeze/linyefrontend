import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DemoItem, CreateDemoItem, UpdateDemoItem } from '../models/demo-item.model';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class DemoItemService {
  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);
  private readonly baseUrl = `${environment.apiUrl}/demoitems`;

  getAll(): Observable<DemoItem[]> {
    return this.http
      .get<ApiResponse<DemoItem[]>>(this.baseUrl)
      .pipe(map(res => this.notification.unwrap(res)));
  }

  getById(id: number): Observable<DemoItem> {
    return this.http
      .get<ApiResponse<DemoItem>>(`${this.baseUrl}/${id}`)
      .pipe(map(res => this.notification.unwrap(res)));
  }

  create(dto: CreateDemoItem): Observable<DemoItem> {
    return this.http
      .post<ApiResponse<DemoItem>>(this.baseUrl, dto)
      .pipe(map(res => this.notification.unwrap(res)));
  }

  update(id: number, dto: UpdateDemoItem): Observable<DemoItem> {
    return this.http
      .put<ApiResponse<DemoItem>>(`${this.baseUrl}/${id}`, dto)
      .pipe(map(res => this.notification.unwrap(res)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        this.notification.unwrap(res);
      })
    );
  }
}
