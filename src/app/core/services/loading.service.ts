import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly counter = signal(0);

  readonly isLoading = this.counter.asReadonly();

  show(): void {
    this.counter.update((n) => n + 1);
  }

  hide(): void {
    this.counter.update((n) => Math.max(0, n - 1));
  }
}
