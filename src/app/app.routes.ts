import { Routes } from '@angular/router';
import { DemoItemsListComponent } from './features/demo-items/demo-items-list/demo-items-list.component';
import { DemoItemFormComponent } from './features/demo-items/demo-item-form/demo-item-form.component';
import { BlobFilesComponent } from './features/blob-files/blob-files.component';
import { CsvPreviewComponent } from './features/csv-preview/csv-preview.component';

export const routes: Routes = [
  { path: '', component: DemoItemsListComponent, data: { pageTitle: 'Demo 一覧' } },
  { path: 'demoitems/new', component: DemoItemFormComponent, data: { pageTitle: 'Demo 新規' } },
  { path: 'demoitems/edit/:id', component: DemoItemFormComponent, data: { pageTitle: 'Demo 編集' } },
  { path: 'blob-files', component: BlobFilesComponent, data: { pageTitle: 'Blob ファイル' } },
  { path: 'csv-preview', component: CsvPreviewComponent, data: { pageTitle: 'CSV プレビュー' } },
  { path: '**', redirectTo: '' }
];
