import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlobApiService } from '../../../core/services/blob-api.service';
import { ApplicationTypeDto, ApplicationTypeService } from '../../../core/services/application-type.service';

@Component({
  selector: 'app-csv-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './csv-preview.component.html',
  styleUrl: './csv-preview.component.scss'
})
export class CsvPreviewComponent implements OnInit {
  container: string | undefined;
  blobName: string | undefined;

  headers: string[] = [];
  rows: string[][] = [];

  selectedRowIndex: number | null = null;

  applicationTypes: ApplicationTypeDto[] = [];
  selectedTypeId: number | null = null;
  mappedFields: Record<string, string> | null = null;

  loading = false;
  error: string | null = null;
  csvSourceInfo = '';

  constructor(
    private route: ActivatedRoute,
    private blobApi: BlobApiService,
    private appTypeService: ApplicationTypeService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(q => {
      this.container = q['container'];
      this.blobName = q['blobName'];
      if (this.blobName) {
        this.csvSourceInfo = `Blob から: ${this.container ?? '(既定コンテナ)'} / ${this.blobName}`;
        this.loadCsvFromBlob();
      } else {
        this.csvSourceInfo = 'Blob ファイル画面で CSV を選択するか、下から手動アップロードしてください。';
      }
    });

    this.appTypeService.getAllTypes().subscribe({
      next: list => (this.applicationTypes = list),
      error: () => {}
    });
  }

  loadCsvFromBlob(): void {
    if (!this.blobName) return;
    this.loading = true;
    this.error = null;
    this.blobApi.getContent(this.container, this.blobName).subscribe({
      next: async blob => {
        const text = await blob.text();
        this.parseCsv(text);
        this.loading = false;
      },
      error: err => {
        this.error = err?.message ?? 'CSV の読み込みに失敗しました。';
        this.loading = false;
      }
    });
  }

  onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.container = undefined;
    this.blobName = file.name;
    this.csvSourceInfo = `ローカルファイル: ${file.name}`;
    this.loading = true;
    this.error = null;
    file
      .text()
      .then(text => {
        this.parseCsv(text);
        this.loading = false;
      })
      .catch(err => {
        this.error = (err as Error).message ?? 'CSV の読み取りに失敗しました。';
        this.loading = false;
      });
  }

  parseCsv(text: string): void {
    this.headers = [];
    this.rows = [];
    this.selectedRowIndex = null;
    this.mappedFields = null;

    const lines = text.split(/\r?\n/).map(l => l.trimEnd()).filter(l => l.length > 0);
    if (!lines.length) return;

    this.headers = this.splitCsvLine(lines[0]);
    for (let i = 1; i < lines.length; i++) {
      const row = this.splitCsvLine(lines[i]);
      if (row.length === 1 && row[0] === '') continue;
      this.rows.push(row);
    }
  }

  splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (ch === '"') {
        const next = line[i + 1];
        if (inQuotes && next === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  selectRow(index: number): void {
    this.selectedRowIndex = index;
    this.tryMap();
  }

  onTypeChange(): void {
    this.tryMap();
  }

  tryMap(): void {
    this.mappedFields = null;
    if (this.selectedRowIndex == null || this.selectedTypeId == null) return;
    const row = this.rows[this.selectedRowIndex];
    if (!row) return;

    this.appTypeService.mapRow(this.selectedTypeId, row).subscribe({
      next: res => (this.mappedFields = res),
      error: () => {}
    });
  }

  get selectedRow(): string[] | null {
    if (this.selectedRowIndex == null) return null;
    return this.rows[this.selectedRowIndex] ?? null;
  }
}
