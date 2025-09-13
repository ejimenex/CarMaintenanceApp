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
import { eyeOff, analytics, notifications, location } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';

@Component({
  selector: 'app-consent-management',
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
  templateUrl: './consent-management.component.html',
  styleUrls: ['./consent-management.component.scss']
})
export class ConsentManagementComponent {
  
  consentSettings = [
    {
      id: 'analytics',
      title: 'Analytics y Estadísticas',
      description: 'Permitir el seguimiento de uso para mejorar la aplicación',
      icon: 'analytics',
      enabled: true
    },
    {
      id: 'notifications',
      title: 'Notificaciones Push',
      description: 'Recibir notificaciones sobre mantenimientos y servicios',
      icon: 'notifications',
      enabled: true
    },
    {
      id: 'location',
      title: 'Ubicación',
      description: 'Compartir ubicación para encontrar talleres cercanos',
      icon: 'location',
      enabled: false
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Recibir ofertas y promociones personalizadas',
      icon: 'eyeOff',
      enabled: false
    }
  ];

  constructor(private alertService: AlertService) {
    addIcons({ eyeOff, analytics, notifications, location });
  }

  toggleConsent(setting: any) {
    setting.enabled = !setting.enabled;
    this.alertService.showSuccess(`Consentimiento ${setting.enabled ? 'activado' : 'desactivado'}: ${setting.title}`);
  }
}
