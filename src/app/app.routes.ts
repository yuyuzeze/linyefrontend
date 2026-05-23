import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { DemoItemsListComponent } from './features/demo-items/demo-items-list/demo-items-list.component';
import { DemoItemFormComponent } from './features/demo-items/demo-item-form/demo-item-form.component';
import { BlobFilesComponent } from './features/blob-files/blob-files.component';
import { CsvPreviewComponent } from './features/csv-preview/csv-preview.component';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';

export const routes: Routes = [
  {
    path: '',
    component: DemoItemsListComponent,
    data: { pageTitle: 'Demo 一覧' },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'demoitems/new',
    component: DemoItemFormComponent,
    data: { pageTitle: 'Demo 新規' },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'demoitems/edit/:id',
    component: DemoItemFormComponent,
    data: { pageTitle: 'Demo 編集' },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'blob-files',
    component: BlobFilesComponent,
    data: { pageTitle: 'Blob ファイル' },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'csv-preview',
    component: CsvPreviewComponent,
    data: { pageTitle: 'CSV プレビュー' },
    canActivate: [authGuard, roleGuard]
  },
  { path: 'unauthorized', component: UnauthorizedComponent, data: { pageTitle: 'アクセス拒否' } },
  { path: '**', redirectTo: '' }
];
