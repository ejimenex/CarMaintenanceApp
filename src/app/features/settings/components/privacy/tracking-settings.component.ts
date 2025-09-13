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
import { analytics, eyeOff, shieldCheckmark } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';

@Component({
  selector: 'app-tracking-settings',
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
  templateUrl: './tracking-settings.component.html',
  styleUrls: ['./tracking-settings.component.scss']
})
export class TrackingSettingsComponent {
  
  trackingSettings = [
    {
      id: 'analytics',
      title: 'Analytics de Uso',
      description: 'Recopilar datos de uso para mejorar la aplicación',
      icon: 'analytics',
      enabled: true
    },
    {
      id: 'crash',
      title: 'Reportes de Errores',
      description: 'Enviar reportes automáticos de errores',
      icon: 'shieldCheckmark',
      enabled: true
    },
    {
      id: 'performance',
      title: 'Métricas de Rendimiento',
      description: 'Monitorear el rendimiento de la aplicación',
      icon: 'analytics',
      enabled: false
    },
    {
      id: 'personalization',
      title: 'Personalización',
      description: 'Usar datos para personalizar la experiencia',
      icon: 'eyeOff',
      enabled: false
    }
  ];

  constructor(private alertService: AlertService) {
    addIcons({ analytics, eyeOff, shieldCheckmark });
  }

  toggleTracking(setting: any) {
    setting.enabled = !setting.enabled;
    this.alertService.showSuccess(`Seguimiento ${setting.enabled ? 'activado' : 'desactivado'}: ${setting.title}`);
  }
}
