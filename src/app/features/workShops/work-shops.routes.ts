import { Routes } from '@angular/router';

export const workShopsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./crud/list/work-shops-list.component').then(m => m.WorkShopsListComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./crud/add/work-shops-add.component').then(m => m.WorkShopsAddComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./crud/edit/work-shops-edit.component').then(m => m.WorkShopsEditComponent)
  }
];
