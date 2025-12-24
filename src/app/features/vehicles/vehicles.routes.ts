import { Routes } from '@angular/router';

export const VEHICLES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./crud/list/vehicles-list.component').then((m) => m.VehiclesListComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./crud/add/vehicles-add.component').then((m) => m.VehiclesAddComponent)
  },
  {
    path: 'edit/:id',
      loadComponent: () =>
        import('./crud/edit/vehicles-edit.component').then((m) => m.VehiclesEditComponent)
    },
  {
    path: 'dashboard/:id',
    loadComponent: () =>
      import('./vehicleDashBoard/vehicleDashboard.component').then((m) => m.VehicleDashboardComponent)
  },
  // {
  //   path: 'detail/:id',
  //   loadComponent: () =>
  //     import('./crud/detail/vehicles-detail.component').then((m) => m.VehiclesDetailComponent)
  // }
]; 