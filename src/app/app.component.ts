import { Component, OnInit, Optional } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthContextService } from './core/services/auth-context.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  /** ヘッダー表示用（ルート data.pageTitle） */
  title = '業務メニュー';
  readonly today = new Date();
  readonly authEnabled = environment.auth.enabled;

  constructor(
    private readonly router: Router,
    private readonly authContext: AuthContextService,
    readonly loading: LoadingService,
    @Optional() private readonly msalService: MsalService | null
  ) {}

  get userLabel(): string {
    const me = this.authContext.snapshot;
    return me?.displayName || me?.upn || '—';
  }

  get departmentLabel(): string {
    const me = this.authContext.snapshot;
    return me?.departmentName || me?.departmentCode || '';
  }

  logout(): void {
    if (!this.authEnabled) {
      return;
    }
    this.authContext.clear();
    this.msalService?.logoutRedirect();
  }

  ngOnInit(): void {
    const applyTitle = () => {
      const leaf = this.leafRoute(this.router.routerState.snapshot.root);
      const t = leaf.data['pageTitle'];
      this.title = typeof t === 'string' ? t : '業務メニュー';
    };
    applyTitle();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(applyTitle);
  }

  private leafRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let r = route;
    while (r.firstChild) {
      r = r.firstChild;
    }
    return r;
  }
}
