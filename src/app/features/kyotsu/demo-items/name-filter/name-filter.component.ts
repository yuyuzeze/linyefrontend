import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-name-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline" class="name-filter">
      <mat-label>名称で絞り込み</mat-label>
      <input
        matInput
        placeholder="名称キーワードを入力"
        [(ngModel)]="value"
        (ngModelChange)="valueChange.emit($event)"
      />
    </mat-form-field>
  `,
  styles: [
    `
      .name-filter {
        min-width: 200px;
        margin-right: 1rem;
      }
    `
  ]
})
export class NameFilterComponent {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
}

