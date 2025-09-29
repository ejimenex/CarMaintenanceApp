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
  }
];
