import { Routes } from '@angular/router';

export const WORKSHOPS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./crud/list/work-shops-list.component').then((m) => m.WorkShopsListComponent)
  },
  {
    path: 'near-me',
    loadComponent: () =>
      import('./crud/near-me/workshops-near-me.component').then((m) => m.WorkshopsNearMeComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./crud/add/work-shops-add.component').then((m) => m.WorkShopsAddComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./crud/edit/work-shops-edit.component').then((m) => m.WorkShopsEditComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./crud/detail/work-shops-detail.component').then((m) => m.WorkShopsDetailComponent)
  }
]; 