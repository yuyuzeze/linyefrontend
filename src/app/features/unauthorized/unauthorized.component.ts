import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="unauthorized">
      <h1>アクセス拒否</h1>
      <p>この画面を表示する権限がありません。</p>
      <a routerLink="/kyotsu">ホームに戻る</a>
    </div>
  `,
  styles: `
    .unauthorized {
      padding: 2rem;
      text-align: center;
    }
  `
})
export class UnauthorizedComponent {}
