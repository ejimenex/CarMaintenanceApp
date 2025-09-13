import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, warning, checkmarkCircle } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonIcon
  ],
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent {
  
  notificationSettings = [
    {
      id: 'maintenance',
      title: 'Recordatorios de Mantenimiento',
      description: 'Notificaciones sobre servicios programados',
      icon: 'checkmarkCircle',
      enabled: true
    },
    {
      id: 'workshop',
      title: 'Ofertas de Talleres',
      description: 'Promociones y ofertas especiales',
      icon: 'notifications',
      enabled: true
    },
    {
      id: 'alerts',
      title: 'Alertas de Seguridad',
      description: 'Notificaciones importantes sobre tu vehículo',
      icon: 'warning',
      enabled: true
    },
    {
      id: 'updates',
      title: 'Actualizaciones de la App',
      description: 'Nuevas funciones y mejoras',
      icon: 'notifications',
      enabled: false
    }
  ];

  constructor(private alertService: AlertService) {
    addIcons({ notifications, warning, checkmarkCircle });
  }

  toggleNotification(setting: any) {
    setting.enabled = !setting.enabled;
    this.alertService.showSuccess(`Notificación ${setting.enabled ? 'activada' : 'desactivada'}: ${setting.title}`);
  }
}
