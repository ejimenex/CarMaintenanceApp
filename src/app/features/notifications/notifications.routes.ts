import { Routes } from '@angular/router';

export const notificationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/notifications-list.component').then((m) => m.NotificationsListComponent),
  }
];
