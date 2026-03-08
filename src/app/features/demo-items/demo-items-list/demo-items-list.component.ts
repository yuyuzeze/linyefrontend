import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DemoItemService } from '../../../core/services/demo-item.service';
import { DemoItem } from '../../../core/models/demo-item.model';

@Component({
  selector: 'app-demo-items-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './demo-items-list.component.html',
  styleUrl: './demo-items-list.component.scss'
})
export class DemoItemsListComponent implements OnInit {
  items: DemoItem[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private service: DemoItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.error = null;
    this.service.getAll().subscribe({
      next: (data: DemoItem[]) => {
        this.items = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.message || '加载失败';
        this.loading = false;
      }
    });
  }

  delete(id: number): void {
    if (!confirm('确定删除此项？')) return;
    this.service.delete(id).subscribe({
      next: () => this.loadItems(),
      error: (err: HttpErrorResponse) => this.error = err.message || '删除失败'
    });
  }

  edit(id: number): void {
    this.router.navigate(['/demoitems', 'edit', id]);
  }
}
