import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApplicationTypeDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  displayOrder: number;
}

export interface ApplicationTypeFieldDto {
  id: number;
  applicationTypeId: number;
  fieldCode: string;
  fieldName: string;
  dataType: string;
  displayOrder: number;
  isRequired: boolean;
}

export interface CsvColumnMappingDto {
  id: number;
  applicationTypeId: number;
  csvColumnIndex: number;
  csvColumnName?: string;
  targetFieldCode: string;
}

@Injectable({ providedIn: 'root' })
export class ApplicationTypeService {
  private readonly base = `${environment.apiUrl}/application-types`;

  constructor(private http: HttpClient) {}

  getAllTypes(): Observable<ApplicationTypeDto[]> {
    return this.http.get<ApplicationTypeDto[]>(this.base);
  }

  getById(id: number): Observable<ApplicationTypeDto> {
    return this.http.get<ApplicationTypeDto>(`${this.base}/${id}`);
  }

  getFields(id: number): Observable<ApplicationTypeFieldDto[]> {
    return this.http.get<ApplicationTypeFieldDto[]>(`${this.base}/${id}/fields`);
  }

  getCsvMappings(id: number): Observable<CsvColumnMappingDto[]> {
    return this.http.get<CsvColumnMappingDto[]>(`${this.base}/${id}/csv-mappings`);
  }

  mapRow(applicationTypeId: number, values: string[]): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`${this.base}/${applicationTypeId}/map-row`, { values });
  }
}
