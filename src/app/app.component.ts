import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  /** ヘッダー表示用（ルート data.pageTitle） */
  title = '業務メニュー';
  readonly today = new Date();

  constructor(private readonly router: Router) {}

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
