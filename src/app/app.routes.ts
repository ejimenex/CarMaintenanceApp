import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'vehicles',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    redirectTo: 'vehicles',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/components/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },

  {
    path: 'workshops',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/workShops/work-shops.routes').then((m) => m.workShopsRoutes),
  },
  {
    path: 'vehicles',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/vehicles/vehicles.routes').then((m) => m.VEHICLES_ROUTES),
  },
  {
    path: 'user-preference',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/user-preference/user-prefeence.component').then((m) => m.UserPreferenceComponent),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
  },
  {
    path: 'help',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/help/help.component').then((m) => m.HelpComponent),
  },
  {
    path: 'notifications',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/notifications/notifications.routes').then((m) => m.notificationsRoutes),
  },
];
