import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="unauthorized">
      <h1>アクセス権限がありません</h1>
      <p>管理者に業務ロールの割り当てを依頼してください。</p>
      <a routerLink="/">ホームへ戻る</a>
    </div>
  `,
  styles: [
    `
      .unauthorized {
        padding: 2rem;
        text-align: center;
      }
    `
  ]
})
export class UnauthorizedComponent {}
