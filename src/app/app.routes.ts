import { Routes } from '@angular/router';

import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', redirectTo: 'kyotsu', pathMatch: 'full' },
  {
    path: 'kyotsu',
    loadChildren: () => import('./features/kyotsu/kyotsu.routes').then(m => m.KYOTSU_ROUTES)
  },
  { path: 'unauthorized', component: UnauthorizedComponent, data: { pageTitle: 'アクセス拒否' } },
  { path: '**', redirectTo: 'kyotsu' }
];
