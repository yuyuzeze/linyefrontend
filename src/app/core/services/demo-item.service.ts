import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DemoItem, CreateDemoItem, UpdateDemoItem } from '../models/demo-item.model';

@Injectable({ providedIn: 'root' })
export class DemoItemService {
  private readonly baseUrl = `${environment.apiUrl}/demoitems`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DemoItem[]> {
    return this.http.get<DemoItem[]>(this.baseUrl);
  }

  getById(id: number): Observable<DemoItem> {
    return this.http.get<DemoItem>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateDemoItem): Observable<DemoItem> {
    return this.http.post<DemoItem>(this.baseUrl, dto);
  }

  update(id: number, dto: UpdateDemoItem): Observable<DemoItem> {
    return this.http.put<DemoItem>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
