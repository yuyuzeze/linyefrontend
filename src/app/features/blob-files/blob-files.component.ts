import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlobApiService, BlobItemDto, BlobListResultDto } from '../../core/services/blob-api.service';

@Component({
  selector: 'app-blob-files',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blob-files.component.html',
  styleUrl: './blob-files.component.scss'
})
export class BlobFilesComponent implements OnInit {
  prefixes: BlobItemDto[] = [];
  items: BlobItemDto[] = [];
  searchText = '';
  loading = true;
  error: string | null = null;
  currentPrefix = '';
  container = '';

  constructor(
    private blobApi: BlobApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(q => {
      this.currentPrefix = q['prefix'] ?? '';
      this.container = q['container'] ?? '';
      this.loadList();
    });
  }

  loadList(): void {
    this.loading = true;
    this.error = null;
    this.blobApi.list(this.container || undefined, this.currentPrefix || undefined).subscribe({
      next: (res: BlobListResultDto) => {
        this.prefixes = res.prefixes ?? [];
        this.items = res.items ?? [];
        this.loading = false;
      },
      error: err => {
        this.error = err?.message ?? '加载失败';
        this.loading = false;
      }
    });
  }

  get filteredPrefixes(): BlobItemDto[] {
    if (!this.searchText.trim()) return this.prefixes;
    const s = this.searchText.toLowerCase();
    return this.prefixes.filter(p => p.name.toLowerCase().includes(s));
  }

  get filteredItems(): BlobItemDto[] {
    if (!this.searchText.trim()) return this.items;
    const s = this.searchText.toLowerCase();
    return this.items.filter(i => i.name.toLowerCase().includes(s));
  }

  goToPrefix(prefixName: string): void {
    const newPrefix = this.currentPrefix ? `${this.currentPrefix}${prefixName}/` : `${prefixName}/`;
    this.router.navigate([], {
      queryParams: { prefix: newPrefix, container: this.container || undefined },
      queryParamsHandling: 'merge'
    });
  }

  goUp(): void {
    if (!this.currentPrefix) return;
    const parts = this.currentPrefix.replace(/\/$/, '').split('/').filter(Boolean);
    parts.pop();
    const newPrefix = parts.length ? parts.join('/') + '/' : '';
    this.router.navigate([], {
      queryParams: { prefix: newPrefix || null, container: this.container || undefined },
      queryParamsHandling: 'merge'
    });
  }

  openCsv(blobName: string): void {
    this.router.navigate(['/csv-preview'], {
      queryParams: { container: this.container || undefined, blobName }
    });
  }

  canGoUp(): boolean {
    return !!this.currentPrefix?.replace(/\/$/, '').trim();
  }
}
