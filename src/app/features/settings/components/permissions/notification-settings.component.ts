import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
    TranslateModule,
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
  
  notificationSettings: any[] = [];

  constructor(
    private alertService: AlertService,
    private translateService: TranslateService
  ) {
    addIcons({ notifications, warning, checkmarkCircle });
    this.initializeNotificationSettings();
  }

  private initializeNotificationSettings() {
    this.notificationSettings = [
      {
        id: 'maintenance',
        titleKey: 'notifications.categories.maintenance',
        descriptionKey: 'Notificaciones sobre servicios programados',
        icon: 'checkmarkCircle',
        enabled: true
      },
      {
        id: 'workshop',
        titleKey: 'Ofertas de Talleres',
        descriptionKey: 'Promociones y ofertas especiales',
        icon: 'notifications',
        enabled: true
      },
      {
        id: 'alerts',
        titleKey: 'Alertas de Seguridad',
        descriptionKey: 'Notificaciones importantes sobre tu vehículo',
        icon: 'warning',
        enabled: true
      },
      {
        id: 'updates',
        titleKey: 'Actualizaciones de la App',
        descriptionKey: 'Nuevas funciones y mejoras',
        icon: 'notifications',
        enabled: false
      }
    ];
  }

  toggleNotification(setting: any) {
    setting.enabled = !setting.enabled;
    const status = setting.enabled ? 'activada' : 'desactivada';
    const title = this.translateService.instant(setting.titleKey);
    this.alertService.showSuccess(`Notificación ${status}: ${title}`);
  }
}
