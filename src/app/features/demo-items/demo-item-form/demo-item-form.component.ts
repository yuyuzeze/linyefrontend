import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DemoItemService } from '../../../core/services/demo-item.service';
import { CreateDemoItem, UpdateDemoItem } from '../../../core/models/demo-item.model';

@Component({
  selector: 'app-demo-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './demo-item-form.component.html',
  styleUrl: './demo-item-form.component.scss'
})
export class DemoItemFormComponent implements OnInit {
  name = '';
  description = '';
  isEdit = false;
  id: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DemoItemService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.isEdit = true;
      this.loadItem(this.id);
    }
  }

  loadItem(id: number): void {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (item) => {
        this.name = item.name;
        this.description = item.description ?? '';
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.message || '加载失败';
        this.loading = false;
      }
    });
  }

  submit(): void {
    this.error = null;
    if (!this.name.trim()) {
      this.error = '请输入名称';
      return;
    }
    this.loading = true;
    const dto = { name: this.name.trim(), description: this.description.trim() || null };

    if (this.isEdit && this.id !== null) {
      this.service.update(this.id, dto as UpdateDemoItem).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message || '更新失败';
          this.loading = false;
        }
      });
    } else {
      this.service.create(dto as CreateDemoItem).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message || '创建失败';
          this.loading = false;
        }
      });
    }
  }
}
