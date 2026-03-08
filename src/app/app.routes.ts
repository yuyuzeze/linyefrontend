import { Routes } from '@angular/router';
import { DemoItemsListComponent } from './features/demo-items/demo-items-list/demo-items-list.component';
import { DemoItemFormComponent } from './features/demo-items/demo-item-form/demo-item-form.component';

export const routes: Routes = [
  { path: '', component: DemoItemsListComponent },
  { path: 'demoitems/new', component: DemoItemFormComponent },
  { path: 'demoitems/edit/:id', component: DemoItemFormComponent },
  { path: '**', redirectTo: '' }
];
