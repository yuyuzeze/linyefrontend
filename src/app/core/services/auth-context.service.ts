import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthMe } from '../models/auth-me.model';

@Injectable({ providedIn: 'root' })
export class AuthContextService {
  private me$?: Observable<AuthMe>;
  private cached?: AuthMe;

  constructor(private readonly http: HttpClient) {}

  get snapshot(): AuthMe | undefined {
    return this.cached;
  }

  ensureLoaded(): Observable<AuthMe> {
    if (!this.me$) {
      this.me$ = this.http.get<AuthMe>(`${environment.apiUrl}/auth/me`).pipe(
        tap(me => (this.cached = me)),
        shareReplay(1)
      );
    }
    return this.me$;
  }

  reload(): Observable<AuthMe> {
    this.me$ = undefined;
    return this.ensureLoaded();
  }

  hasAnyRole(...roles: string[]): boolean {
    const me = this.cached;
    if (!me) {
      return !environment.auth.enabled;
    }
    if (me.roles.includes('All')) {
      return true;
    }
    return roles.some(r => me.roles.includes(r));
  }

  clear(): void {
    this.me$ = undefined;
    this.cached = undefined;
  }
}
