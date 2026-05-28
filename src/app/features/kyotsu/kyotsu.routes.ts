import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

/** 共通（Kyotsu）サブシステム — 遅延読み込み */
export const KYOTSU_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./demo-items/demo-items-list/demo-items-list.component').then(m => m.DemoItemsListComponent),
    data: { pageTitle: 'Demo 一覧' },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'demoitems/new',
    loadComponent: () =>
      import('./demo-items/demo-item-form/demo-item-form.component').then(m => m.DemoItemFormComponent),
    data: { pageTitle: 'Demo 新規' },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'demoitems/edit/:id',
    loadComponent: () =>
      import('./demo-items/demo-item-form/demo-item-form.component').then(m => m.DemoItemFormComponent),
    data: { pageTitle: 'Demo 編集' },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'blob-files',
    loadComponent: () =>
      import('./blob-files/blob-files.component').then(m => m.BlobFilesComponent),
    data: { pageTitle: 'Blob ファイル' },
    canActivate: [authGuard, roleGuard]
  }
];
