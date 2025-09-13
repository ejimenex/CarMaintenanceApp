import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonItemSliding } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personCircle, 
  shieldCheckmark, 
  location, 
  phonePortrait, 
  time, 
  chevronForward,
  trash,
  logOut,
  key,
  mail,
  documentText,
  download,
  eyeOff,
  analytics,
  notifications,
  lockClosed,
  list,
  trashBin
} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,

  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  
  settingsCategories = [
    {
      title: 'Cuenta',
      icon: 'personCircle',
      items: [
        { title: 'Eliminar cuenta y datos', icon: 'trash', route: '/settings/account/delete', description: 'Eliminar permanentemente tu cuenta y todos los datos asociados' },
        { title: 'Cerrar sesión', icon: 'logOut', route: '/settings/account/logout', description: 'Terminar sesión actual' },
        { title: 'Cambiar contraseña', icon: 'key', route: '/settings/account/password', description: 'Actualizar tu contraseña' },
        { title: 'Actualizar perfil', icon: 'mail', route: '/settings/account/profile', description: 'Editar información personal' }
      ]
    },
    {
      title: 'Privacidad y Datos',
      icon: 'shieldCheckmark',
      items: [
        { title: 'Política de privacidad', icon: 'documentText', route: '/settings/privacy/policy', description: 'Ver política de privacidad' },
      //  { title: 'Exportar mis datos', icon: 'download', route: '/settings/privacy/export', description: 'Descargar todos tus datos' },
        { title: 'Gestión de consentimiento', icon: 'eyeOff', route: '/settings/privacy/consent', description: 'Revisar permisos de tracking' },
        { title: 'Limitar seguimiento', icon: 'analytics', route: '/settings/privacy/tracking', description: 'Opt-out de estadísticas' }
      ]
    },
    {
      title: 'Permisos y Seguridad',
      icon: 'location',
      items: [
        { title: 'Permisos de ubicación', icon: 'location', route: '/settings/permissions/location', description: 'Gestionar permisos de ubicación' },
        { title: 'Notificaciones push', icon: 'notifications', route: '/settings/permissions/notifications', description: 'Configurar notificaciones' },
        { title: 'Verificación en dos pasos', icon: 'lockClosed', route: '/settings/permissions/2fa', description: 'Configurar 2FA' }
      ]
    },
    // {
    //   title: 'Sesión y Dispositivos',
    //   icon: 'phonePortrait',
    //   items: [
    //     { title: 'Cerrar sesión en otros dispositivos', icon: 'phonePortrait', route: '/settings/sessions/logout-all', description: 'Terminar sesiones en otros dispositivos' },
    //     { title: 'Dispositivos activos', icon: 'list', route: '/settings/sessions/devices', description: 'Ver dispositivos con sesión activa' }
    //   ]
    // },
    {
      title: 'Historial y Actividad',
      icon: 'time',
      items: [
        { title: 'Historial de actividad', icon: 'list', route: '/settings/history/activity', description: 'Ver historial de actividades' },
      //  { title: 'Eliminar actividad específica', icon: 'trashBin', route: '/settings/history/delete', description: 'Eliminar actividades específicas' }
      ]
    }
  ];

  constructor() {
    addIcons({ 
      personCircle, 
      shieldCheckmark, 
      location, 
      phonePortrait, 
      time, 
      chevronForward,
      trash,
      logOut,
      key,
      mail,
      documentText,
      download,
      eyeOff,
      analytics,
      notifications,
      lockClosed,

      list,
      trashBin
    });
  }
}
