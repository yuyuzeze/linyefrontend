import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DemoItemService } from '../../../core/services/demo-item.service';
import { DemoItem } from '../../../core/models/demo-item.model';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NameFilterComponent } from '../name-filter/name-filter.component';

@Component({
  selector: 'app-demo-items-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NameFilterComponent
  ],
  templateUrl: './demo-items-list.component.html',
  styleUrl: './demo-items-list.component.scss'
})
export class DemoItemsListComponent implements OnInit {
  items: DemoItem[] = [];
  nameFilter = '';
  filterDate: Date | null = null;
  displayedColumns: string[] = ['id', 'name', 'description', 'createdAt', 'actions'];
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

  get filteredItems(): DemoItem[] {
    return this.items.filter(item => {
      const matchName =
        !this.nameFilter ||
        item.name.toLowerCase().includes(this.nameFilter.toLowerCase());

      const matchDate =
        !this.filterDate ||
        new Date(item.createdAt).toDateString() === this.filterDate.toDateString();

      return matchName && matchDate;
    });
  }

  clearFilters(): void {
    this.nameFilter = '';
    this.filterDate = null;
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
