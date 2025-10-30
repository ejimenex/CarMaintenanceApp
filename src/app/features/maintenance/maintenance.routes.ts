import { Routes } from '@angular/router';

export const maintenanceRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./list/maintenance-list.component').then(m => m.MaintenanceListComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./add/maintenance-add.component').then(m => m.MaintenanceAddComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./edit/maintenance-edit.component').then(m => m.MaintenanceEditComponent)
  },
  {
    path: 'fuel/list/:id',
    loadComponent: () => import('./fuel/list/fuel-detail-list.component').then(m => m.FuelDetailListComponent)
  },
  {
    path: 'fuel/add/:id',
    loadComponent: () => import('./fuel/add/fuel-detail-add.component').then(m => m.FuelDetailAddComponent)
  },
  {
    path: 'insurance/list/:id',
    loadComponent: () => import('./insurance/list/insurance-detail-list.component').then(m => m.InsuranceDetailListComponent)
  },
  {
    path: 'insurance/add/:id',
    loadComponent: () => import('./insurance/add/insurance-detail-add.component').then(m => m.InsuranceDetailAddComponent)
  },
  {
    path: 'detail/list/:id',
    loadComponent: () => import('./detail/list/maintenance-detail-list.component').then(m => m.MaintenanceDetailListComponent)
  },
  {
    path: 'detail/add/:id',
    loadComponent: () => import('./detail/add/maintenance-detail-add.component').then(m => m.MaintenanceDetailAddComponent)
  },
  {
    path: 'detail/edit/:id',
    loadComponent: () => import('./detail/edit/maintenance-detail-edit.component').then(m => m.MaintenanceDetailEditComponent)
  }
];
