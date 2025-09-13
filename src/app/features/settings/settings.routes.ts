import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./settings.component').then((m) => m.SettingsComponent),
  },
  // Account routes
  {
    path: 'account/delete',
    loadComponent: () =>
      import('./components/account/delete-account/delete-account.component').then((m) => m.DeleteAccountComponent),
  },
  {
    path: 'account/logout',
    loadComponent: () =>
      import('./components/account/logout.component').then((m) => m.LogoutComponent),
  },
  {
    path: 'account/password',
    loadComponent: () =>
      import('./components/account/change-password/change-password.component').then((m) => m.ChangePasswordComponent),
  },
  {
    path: 'account/profile',
    loadComponent: () =>
      import('./components/account/update-profile.component').then((m) => m.UpdateProfileComponent),
  },
  // Privacy routes
  {
    path: 'privacy/policy',
    loadComponent: () =>
      import('./components/privacy/privacy-policy.component').then((m) => m.PrivacyPolicyComponent),
  },
  {
    path: 'privacy/export',
    loadComponent: () =>
      import('./components/privacy/export-data.component').then((m) => m.ExportDataComponent),
  },
  {
    path: 'privacy/consent',
    loadComponent: () =>
      import('./components/privacy/consent-management.component').then((m) => m.ConsentManagementComponent),
  },
  {
    path: 'privacy/tracking',
    loadComponent: () =>
      import('./components/privacy/tracking-settings.component').then((m) => m.TrackingSettingsComponent),
  },
  // Permissions routes
  {
    path: 'permissions/location',
    loadComponent: () =>
      import('./components/permissions/location-permissions.component').then((m) => m.LocationPermissionsComponent),
  },
  {
    path: 'permissions/notifications',
    loadComponent: () =>
      import('./components/permissions/notification-settings.component').then((m) => m.NotificationSettingsComponent),
  },
  {
    path: 'permissions/2fa',
    loadComponent: () =>
      import('./components/permissions/two-factor-auth.component').then((m) => m.TwoFactorAuthComponent),
  },
  // Sessions routes
  {
    path: 'sessions/logout-all',
    loadComponent: () =>
      import('./components/sessions/logout-all-devices.component').then((m) => m.LogoutAllDevicesComponent),
  },
  {
    path: 'sessions/devices',
    loadComponent: () =>
      import('./components/sessions/active-devices.component').then((m) => m.ActiveDevicesComponent),
  },
  // History routes
  {
    path: 'history/activity',
    loadComponent: () =>
      import('./components/history/activity-history.component').then((m) => m.ActivityHistoryComponent),
  }
];
