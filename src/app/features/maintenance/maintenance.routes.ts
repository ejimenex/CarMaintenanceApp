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
    path: 'taxe/list/:id',
    loadComponent: () => import('./taxe/list/taxe-detail-list.component').then(m => m.TaxeDetailListComponent)
  },
  {
    path: 'taxe/add/:id',
    loadComponent: () => import('./taxe/add/taxe-detail-add.component').then(m => m.taxeDetailAddComponent)
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
  },
  {
    path: 'part/list/:id',
    loadComponent: () => import('./part/list/part-detail-list.component').then(m => m.PartDetailListComponent)
  },
  {
    path: 'part/add/:id',
    loadComponent: () => import('./part/add/part-add.component').then(m => m.PartAddComponent)
  },
  {
    path: 'part/edit/:id',
    loadComponent: () => import('./part/edit/part-edit.component').then(m => m.PartEditComponent)
  }
];
